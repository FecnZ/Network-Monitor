package com.networkmonitor.schedule;

import com.networkmonitor.service.NetworkScanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScanScheduler {

    private final NetworkScanService networkScanService;

    @Scheduled(fixedDelayString = "${networkmonitor.scan.interval-ms}")
    public void scheduledScan() {
        log.info("=== Escaneo automático disparado por scheduler ===");
        try {
            networkScanService.executeFullScan(null);
        } catch (Exception e) {
            log.error("El escaneo automático falló: ", e);
        }
    }
}