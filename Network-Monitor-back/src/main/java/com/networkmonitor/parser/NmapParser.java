package com.networkmonitor.parser;

import com.networkmonitor.model.Device;
import com.networkmonitor.model.Port;
import com.networkmonitor.scanner.ScanResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class NmapParser {

    /**
     * Combina los dos outputs: MAC/vendor confiables de la Fase 1 (ARP real),
     * puertos de la Fase 2 (-Pn --send-ip, puede traer MAC sintética que ignoramos).
     */
    public List<Device> parseScan(ScanResult scanResult) {
        Map<String, Device> devicesByIp = parsePhase1(scanResult.phase1Output());
        enrichWithPorts(devicesByIp, scanResult.phase2Output());

        List<Device> devices = new ArrayList<>(devicesByIp.values());
        log.info("Parser finalizado. Se detectaron {} dispositivos.", devices.size());
        return devices;
    }

    /**
     * Fase 1: extrae IP, hostname, MAC y vendor. Fuente confiable de identidad.
     */
    private Map<String, Device> parsePhase1(String rawOutput) {
        Map<String, Device> devices = new LinkedHashMap<>();
        if (rawOutput == null || rawOutput.trim().isEmpty()) {
            return devices;
        }

        String[] lines = rawOutput.split("\n");
        Device currentDevice = null;

        for (String rawLine : lines) {
            String line = rawLine.trim();

            if (line.startsWith("Nmap scan report for")) {
                currentDevice = new Device();
                currentDevice.setFirstSeen(LocalDateTime.now());
                currentDevice.setLastSeen(LocalDateTime.now());
                currentDevice.setOnline(true);
                currentDevice.setKnown(false);
                currentDevice.setPorts(new ArrayList<>());

                String info = line.replace("Nmap scan report for ", "");
                String ip;
                if (info.contains("(") && info.contains(")")) {
                    String hostname = info.substring(0, info.indexOf(" ")).trim();
                    ip = info.substring(info.indexOf("(") + 1, info.indexOf(")")).trim();
                    currentDevice.setHostName(hostname);
                } else {
                    ip = info.trim();
                    currentDevice.setHostName("Unknown");
                }
                currentDevice.setIpAddress(ip);
                devices.put(ip, currentDevice);
                continue;
            }

            if (currentDevice == null) continue;

            if (line.startsWith("MAC Address:")) {
                String macInfo = line.replace("MAC Address: ", "");
                if (macInfo.contains(" ")) {
                    String mac = macInfo.substring(0, macInfo.indexOf(" ")).trim();
                    String vendor = macInfo.substring(macInfo.indexOf("(") + 1, macInfo.indexOf(")")).trim();
                    currentDevice.setMacAddress(mac);
                    currentDevice.setVendor(vendor);
                } else {
                    currentDevice.setMacAddress(macInfo.trim());
                    currentDevice.setVendor("Unknown Vendor");
                }
            }
        }
        return devices;
    }

    /**
     * Fase 2: solo extrae puertos, uniendo por IP con lo ya armado en la Fase 1.
     * Deliberadamente NO lee "MAC Address:" aquí -Pn/--send-ip puede devolver una MAC sintética.
     */
    private void enrichWithPorts(Map<String, Device> devicesByIp, String rawOutput) {
        if (rawOutput == null || rawOutput.trim().isEmpty()) {
            return;
        }

        String[] lines = rawOutput.split("\n");
        Device currentDevice = null;

        for (String rawLine : lines) {
            String line = rawLine.trim();

            if (line.startsWith("Nmap scan report for")) {
                String info = line.replace("Nmap scan report for ", "");
                String ip = info.contains("(") && info.contains(")")
                        ? info.substring(info.indexOf("(") + 1, info.indexOf(")")).trim()
                        : info.trim();

                // Reutiliza el Device de la Fase 1; si por algún motivo no existe, lo crea (caso borde)
                currentDevice = devicesByIp.computeIfAbsent(ip, k -> {
                    Device d = new Device();
                    d.setIpAddress(ip);
                    d.setHostName("Unknown");
                    d.setFirstSeen(LocalDateTime.now());
                    d.setLastSeen(LocalDateTime.now());
                    d.setOnline(true);
                    d.setKnown(false);
                    d.setPorts(new ArrayList<>());
                    return d;
                });
                continue;
            }

            if (currentDevice == null) continue;

            if (line.matches("^\\d+/\\w+\\s+\\w+\\s+.*")) {
                String[] parts = line.split("\\s+");
                if (parts.length >= 3) {
                    String[] portAndProto = parts[0].split("/");
                    int portNumber = Integer.parseInt(portAndProto[0]);
                    String protocol = portAndProto[1].toUpperCase();
                    String state = parts[1];
                    String service = parts[2];

                    Port port = Port.builder()
                            .portNumber(portNumber)
                            .protocol(protocol)
                            .state(state)
                            .service(service)
                            .device(currentDevice)
                            .build();
                    currentDevice.getPorts().add(port);
                }
            }
        }
    }
}