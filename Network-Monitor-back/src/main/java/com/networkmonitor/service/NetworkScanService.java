package com.networkmonitor.service;

import com.networkmonitor.model.Device;
import com.networkmonitor.parser.NmapParser;
import com.networkmonitor.repository.DeviceRepository;
import com.networkmonitor.scanner.NetworkDiscoveryService;
import com.networkmonitor.scanner.ScanResult;
import com.networkmonitor.scanner.ScannerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
@RequiredArgsConstructor
@Slf4j
public class NetworkScanService {

    @Value("${networkmonitor.scan.subnet:}")
    private String configuredSubnet;

    private final AtomicBoolean scanInProgress = new AtomicBoolean(false);
    private final NetworkDiscoveryService networkDiscoveryService;
    private final ScannerService scannerService; // El que ejecuta Nmap
    private final NmapParser nmapParser;         // El que traduce el texto
    private final DeviceRepository deviceRepository; // El que guarda en H2

    public boolean isScanInProgress(){
        return scanInProgress.get();
    }

    private String resolveSubnet(String manualSubnet) {
        if (manualSubnet != null && !manualSubnet.isBlank()) {
            return manualSubnet; // el usuario lo pidió explícitamente en la petición
        }
        if (configuredSubnet != null && !configuredSubnet.isBlank()) {
            return configuredSubnet; // valor fijo en application.properties
        }
        return networkDiscoveryService.detectLocalSubnet(); // auto-detección
    }

    /**
     * Orquesta el flujo completo: Escanear -> Parsear -> Guardar en BD
     */
    @Transactional
    @Async
    public void executeFullScan(String subnetParam) {
        if (!scanInProgress.compareAndSet(false, true)) {
            log.warn("Ya hay un escaneo en curso, se ignora esta petición.");
            return;
        }

        try {
            String subnet = resolveSubnet(subnetParam);
            log.info("--- Iniciando ciclo completo de escaneo para la red: {} ---", subnet);

            // 1. Ejecutar Nmap (obtenemos texto crudo)
            ScanResult scanResult = scannerService.runFullScan(subnet);

            // 2. Parsear el texto a objetos Java
            List<Device> parsedDevices = nmapParser.parseScan(scanResult);
            LocalDateTime scanTime = LocalDateTime.now();

            // 3. Lógica inteligente de Guardado (Upsert)
            for (Device parsedDevice : parsedDevices) {
                String mac = parsedDevice.getMacAddress();
                String ip = parsedDevice.getIpAddress();

                // Lógica de Fallback: Si hay MAC la usamos, si no, usamos IP.
                Optional<Device> existingDeviceOpt = (mac != null && !mac.isEmpty())
                        ? deviceRepository.findByMacAddress(mac)
                        : deviceRepository.findByIpAddress(ip);

                Device deviceToSave;

                if (existingDeviceOpt.isPresent()) {
                    // ACTUALIZAR: El dispositivo ya existe
                    deviceToSave = existingDeviceOpt.get();
                    deviceToSave.setIpAddress(ip); // Actualizamos IP por si cambió por DHCP
                    deviceToSave.setLastSeen(scanTime);
                    deviceToSave.setOnline(true);

                    if (mac != null && !mac.isEmpty()) {
                        deviceToSave.setMacAddress(mac);
                    }
                    deviceToSave.getPorts().clear();
                    parsedDevice.getPorts().forEach(port -> {
                        port.setDevice(deviceToSave);
                        deviceToSave.getPorts().add(port);
                    });
                    log.info("Actualizando dispositivo conocido: {} ({})", ip, mac != null ? mac : "Sin MAC");
                } else {
                    // CREAR: Es un dispositivo nuevo
                    deviceToSave = parsedDevice;
                    deviceToSave.setFirstSeen(scanTime);
                    deviceToSave.setLastSeen(scanTime);
                    deviceToSave.setOnline(true);
                    deviceToSave.getPorts().forEach(port -> port.setDevice(deviceToSave));
                    log.info("Registrando NUEVO dispositivo: {} ({})", ip, mac != null ? mac : "Sin MAC");
                }

                deviceRepository.save(deviceToSave);
            }

            markMissingDevicesOffline(parsedDevices);

            log.info("--- Ciclo de escaneo finalizado con éxito ---");
        } finally {
            scanInProgress.set(false);
        }

    }

    private void markMissingDevicesOffline(List<Device> parsedDevices) {
        if (parsedDevices.isEmpty()) {
            // Escaneo no encontró NINGÚN host activo -> probablemente red caída
            deviceRepository.findByOnlineTrue().forEach(d -> d.setOnline(false));
            return;
        }

        List<String> detectedMacs = parsedDevices.stream()
                .map(Device::getMacAddress)
                .filter(mac -> mac != null && !mac.isBlank())
                .toList();

        List<String> detectedIps = parsedDevices.stream()
                .map(Device::getIpAddress)
                .filter(ip -> ip != null && !ip.isBlank())
                .toList();

        List<Device> missingDevices = deviceRepository.findByOnlineTrue().stream()
                .filter(d -> {
                    boolean identifiedByMac = d.getMacAddress() != null && !d.getMacAddress().isBlank();
                    return identifiedByMac
                            ? !detectedMacs.contains(d.getMacAddress())
                            : !detectedIps.contains(d.getIpAddress());
                })
                .toList();

        if (missingDevices.isEmpty()) return;

        missingDevices.forEach(d -> d.setOnline(false));
        deviceRepository.saveAll(missingDevices);
        log.info("Se marcaron {} dispositivos como offline.", missingDevices.size());
    }
}
