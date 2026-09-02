package com.networkmonitor.service;

import com.networkmonitor.model.Device;
import com.networkmonitor.model.Port;
import com.networkmonitor.model.ScanEvent;
import com.networkmonitor.parser.NmapParser;
import com.networkmonitor.repository.DeviceRepository;
import com.networkmonitor.repository.ScanEventRepository;
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
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Function;

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
    private final ScanEventRepository scanEventRepository;
    private final AlertService alertService;

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

    @Transactional
    @Async
    public void executeDiscoveryScan(String subnetParam) {
        runScanCycle(subnetParam, "escaneo rápido (solo descubrimiento)", subnet -> {
            String phase1Output = scannerService.runDiscoveryScan(subnet);
            return new ScanResult(phase1Output, null);
        }, false);
    }

    @Transactional
    @Async
    public void executeFullScan(String subnetParam) {
        runScanCycle(subnetParam, "ciclo completo de escaneo", scannerService::runFullScan, true);
    }

    /**
     * Envuelve cualquier ciclo de escaneo con el guard de scanInProgress (evita solapamiento)
     * y garantiza liberar el flag al terminar, sin importar el resultado.
     */
    private void runGuarded(String label, Runnable scanLogic) {
        if (!scanInProgress.compareAndSet(false, true)) {
            log.warn("Ya hay un escaneo en curso, se ignora esta petición ({}).", label);
            return;
        }
        try {
            scanLogic.run();
        } finally {
            scanInProgress.set(false);
        }
    }

    private void runScanCycle(String subnetParam, String label, Function<String, ScanResult> scanFn, boolean updatePorts) {
        runGuarded(label, () -> {
            String subnet = resolveSubnet(subnetParam);
            log.info("--- Iniciando {} para la red: {} ---", label, subnet);

            ScanResult scanResult = scanFn.apply(subnet);
            List<Device> parsedDevices = nmapParser.parseScan(scanResult);
            LocalDateTime scanTime = LocalDateTime.now();
            List<ScanEvent> scanEvents = new ArrayList<>();

            upsertDevices(parsedDevices, scanTime, scanEvents, updatePorts);
            markMissingDevicesOffline(parsedDevices, scanTime, scanEvents);

            if (!scanEvents.isEmpty()) {
                scanEventRepository.saveAll(scanEvents);
            }
            log.info("--- {} finalizado ({} dispositivos detectados) ---", label, parsedDevices.size());
        });
    }

    @Transactional
    @Async
    public void executeTargetedScan(List<Long> deviceIds) {
        runGuarded("escaneo dirigido de puertos", () -> {
            List<Device> targetDevices = deviceRepository.findAllById(deviceIds);
            if (targetDevices.isEmpty()) {
                log.warn("No se encontraron dispositivos para los ids: {}", deviceIds);
                return;
            }

            List<String> ips = targetDevices.stream().map(Device::getIpAddress).toList();
            log.info("--- Iniciando escaneo dirigido de puertos para {} dispositivo(s) ---", targetDevices.size());

            String phase2Xml = scannerService.runTargetedPortScan(ips);
            Map<String, List<Port>> portsByIp = nmapParser.parsePortsOnly(phase2Xml);

            for (Device device : targetDevices) {
                List<Port> ports = portsByIp.getOrDefault(device.getIpAddress(), List.of());
                device.getPorts().clear();
                ports.forEach(port -> {
                    port.setDevice(device);
                    device.getPorts().add(port);
                });
            }
            deviceRepository.saveAll(targetDevices);
            log.info("--- Escaneo dirigido finalizado ---");
        });
    }

    /**
     * Recorre los dispositivos detectados en este escaneo y hace upsert contra la BD.
     * Dispositivos nuevos disparan evaluación de alertas.
     */
    private List<Device> upsertDevices(List<Device> parsedDevices, LocalDateTime scanTime,
                                       List<ScanEvent> scanEvents, boolean updatePorts) {
        List<Device> savedDevices = new ArrayList<>();
        for (Device parsedDevice : parsedDevices) {
            Optional<Device> existingDeviceOpt = findExistingDevice(parsedDevice);
            boolean isNewDevice = existingDeviceOpt.isEmpty();

            Device deviceToSave = isNewDevice
                    ? prepareNewDevice(parsedDevice, scanTime, scanEvents)
                    : prepareExistingDevice(existingDeviceOpt.get(), parsedDevice, scanTime, scanEvents, updatePorts);

            Device saved = deviceRepository.save(deviceToSave);
            savedDevices.add(saved);

            if (isNewDevice) {
                alertService.evaluate(saved, true);
            }
        }
        return savedDevices;
    }

    private Optional<Device> findExistingDevice(Device parsedDevice) {
        String mac = parsedDevice.getMacAddress();
        return (mac != null && !mac.isEmpty())
                ? deviceRepository.findByMacAddress(mac)
                : deviceRepository.findByIpAddress(parsedDevice.getIpAddress());
    }

    private Device prepareExistingDevice(Device deviceToSave, Device parsedDevice, LocalDateTime scanTime,
                                         List<ScanEvent> scanEvents, boolean updatePorts) {
        String mac = parsedDevice.getMacAddress();
        String ip = parsedDevice.getIpAddress();

        if (!deviceToSave.isOnline()) {
            scanEvents.add(ScanEvent.builder()
                    .device(deviceToSave).timestamp(scanTime).online(true).build());
        }

        deviceToSave.setIpAddress(ip);
        deviceToSave.setLastSeen(scanTime);
        deviceToSave.setOnline(true);
        if (mac != null && !mac.isEmpty()) {
            deviceToSave.setMacAddress(mac);
        }

        // Clave: solo tocar puertos si viene de un escaneo completo (Fase 2 incluida)
        if (updatePorts) {
            deviceToSave.getPorts().clear();
            parsedDevice.getPorts().forEach(port -> {
                port.setDevice(deviceToSave);
                deviceToSave.getPorts().add(port);
            });
        }

        log.info("Actualizando dispositivo conocido: {} ({})", ip, mac != null ? mac : "Sin MAC");
        return deviceToSave;
    }

    private Device prepareNewDevice(Device parsedDevice, LocalDateTime scanTime, List<ScanEvent> scanEvents) {
        parsedDevice.setFirstSeen(scanTime);
        parsedDevice.setLastSeen(scanTime);
        parsedDevice.setOnline(true);
        parsedDevice.getPorts().forEach(port -> port.setDevice(parsedDevice));

        scanEvents.add(ScanEvent.builder()
                .device(parsedDevice).timestamp(scanTime).online(true).build());

        log.info("Registrando NUEVO dispositivo: {} ({})",
                parsedDevice.getIpAddress(),
                parsedDevice.getMacAddress() != null ? parsedDevice.getMacAddress() : "Sin MAC");
        return parsedDevice;
    }

    private List<Device> markMissingDevicesOffline(List<Device> parsedDevices, LocalDateTime scanTime, List<ScanEvent> scanEvents) {
        if (parsedDevices.isEmpty()) {
            List<Device> allOnline = deviceRepository.findByOnlineTrue();
            for (Device d : allOnline) {
                d.setOnline(false);
                scanEvents.add(ScanEvent.builder().device(d).timestamp(scanTime).online(false).build());
            }
            deviceRepository.saveAll(allOnline);
            return allOnline;
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

        for (Device d : missingDevices) {
            d.setOnline(false);
            // REGISTRAMOS EL EVENTO DE DESCONEXIÓN
            scanEvents.add(ScanEvent.builder().device(d).timestamp(scanTime).online(false).build());
        }

        deviceRepository.saveAll(missingDevices);
        log.info("Se marcaron {} dispositivos como offline.", missingDevices.size());
        return missingDevices;
    }
}
