package com.networkmonitor.api;

import com.networkmonitor.scanner.NetworkDiscoveryService;
import com.networkmonitor.service.NetworkScanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/scan")
public class ScanController {

    private final NetworkScanService networkScanService;
    private final NetworkDiscoveryService networkDiscoveryService;

    @Value("${networkmonitor.scan.subnet}")
    private String defaultSubnet;

    @PostMapping("/trigger")
    public ResponseEntity<String> triggerScan(@RequestParam(required = false) String subnet) {
        networkScanService.executeFullScan(subnet);
        return ResponseEntity.ok("Escaneo Iniciado");

    }

    @GetMapping("/detected-subnet")
    public ResponseEntity<Map<String, String>> getDetectedSubnet() {
        String subnet = networkDiscoveryService.detectLocalSubnet();
        return ResponseEntity.ok(Map.of("subnet", subnet));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> getScanStatus() {
        return ResponseEntity.ok(Map.of("inProgress", networkScanService.isScanInProgress()));
    }
}