package com.networkmonitor.parser;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.networkmonitor.model.Device;
import com.networkmonitor.model.Port;
import com.networkmonitor.scanner.ScanResult;
import com.networkmonitor.scanner.xml.NmapAddress;
import com.networkmonitor.scanner.xml.NmapHost;
import com.networkmonitor.scanner.xml.NmapRun;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class NmapParser {

    private final XmlMapper xmlMapper;

    public List<Device> parseScan(ScanResult scanResult) {
        Map<String, Device> devicesByIp = parsePhase1(scanResult.phase1Output());
        enrichWithPorts(devicesByIp, scanResult.phase2Output());

        List<Device> devices = new ArrayList<>(devicesByIp.values());
        log.info("Parser finalizado. Se detectaron {} dispositivos.", devices.size());
        return devices;
    }

    /**
     * Fase 1: fuente confiable de IP, hostname, MAC y vendor (ARP real, sin -Pn/--send-ip).
     */
    private Map<String, Device> parsePhase1(String xmlContent) {
        Map<String, Device> devices = new LinkedHashMap<>();
        List<NmapHost> hosts = parseHosts(xmlContent);

        for (NmapHost host : hosts) {
            if (!host.isUp()) continue;
            String ip = host.getIpAddress();
            if (ip == null) continue;

            Device device = newBareDevice(ip, host.getHostname());

            NmapAddress mac = host.getMacAddress();
            if (mac != null) {
                device.setMacAddress(mac.getAddr());
                device.setVendor(mac.getVendor() != null ? mac.getVendor() : "Unknown Vendor");
            }

            devices.put(ip, device);
        }
        return devices;
    }

    /**
     * Fase 2: solo aporta puertos, uniendo por IP. Deliberadamente NO se lee la MAC aquí
     * -Pn/--send-ip puede devolver una MAC sintética (ver notas del blueprint).
     */
    private void enrichWithPorts(Map<String, Device> devicesByIp, String xmlContent) {
        if (xmlContent == null || xmlContent.isBlank()) return;

        List<NmapHost> hosts = parseHosts(xmlContent);

        for (NmapHost host : hosts) {
            String ip = host.getIpAddress();
            if (ip == null) continue;

            Device device = devicesByIp.computeIfAbsent(ip, k -> newBareDevice(ip, null));

            buildPorts(host).forEach(port -> {
                port.setDevice(device);
                device.getPorts().add(port);
            });
        }
    }

    /**
     * Usado por el escaneo dirigido (Fase 2 sola, sin Fase 1): solo extrae puertos por IP,
     * sin crear identidad de dispositivo (ya se conoce de antes en BD).
     */
    public Map<String, List<Port>> parsePortsOnly(String phase2Xml) {
        Map<String, List<Port>> portsByIp = new LinkedHashMap<>();
        List<NmapHost> hosts = parseHosts(phase2Xml);

        for (NmapHost host : hosts) {
            String ip = host.getIpAddress();
            if (ip == null) continue;
            portsByIp.put(ip, buildPorts(host));
        }
        return portsByIp;
    }

    /**
     * Construye la lista de Port a partir de los puertos reportados por Nmap para un host.
     * Sin asociar Device todavía (se hace en el punto de uso).
     */
    private List<Port> buildPorts(NmapHost host) {
        if (host.getPorts() == null || host.getPorts().getPortList() == null) return List.of();

        return host.getPorts().getPortList().stream()
                .map(nmapPort -> Port.builder()
                        .portNumber(nmapPort.getPortid())
                        .protocol(nmapPort.getProtocol().toUpperCase())
                        .state(nmapPort.getState() != null ? nmapPort.getState().getState() : "unknown")
                        .service(nmapPort.getService() != null ? nmapPort.getService().getName() : "unknown")
                        .build())
                .toList();
    }

    private Device newBareDevice(String ip, String hostname) {
        Device d = new Device();
        d.setIpAddress(ip);
        d.setHostName(hostname != null ? hostname : "Unknown");
        d.setFirstSeen(LocalDateTime.now());
        d.setLastSeen(LocalDateTime.now());
        d.setOnline(true);
        d.setKnown(false);
        d.setPorts(new ArrayList<>());
        return d;
    }

    private List<NmapHost> parseHosts(String xmlContent) {
        try {
            NmapRun run = xmlMapper.readValue(xmlContent, NmapRun.class);
            return run.getHosts() != null ? run.getHosts() : List.of();
        } catch (Exception e) {
            log.error("Error al parsear XML de Nmap: ", e);
            return List.of();
        }
    }
}