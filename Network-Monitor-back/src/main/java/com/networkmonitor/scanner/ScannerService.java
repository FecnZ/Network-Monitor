package com.networkmonitor.scanner;


import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j

public class ScannerService {


    private static final Pattern SUBNET_PATTERN = Pattern.compile("^(\\d{1,3}\\.){3}\\d{1,3}(/\\d{1,2})?$");


    @Value("${networkmonitor.scan.timing-template}")
    private String timingTemplate;

    @Value("${networkmonitor.scan.host-timeout}")
    private String hostTimeout;


    public ScanResult runFullScan(String subnet) {

        validateSubnet(subnet);

        log.info("Fase 1: descubrimiento en {}", subnet);
        String phase1Output = executeCommand("nmap", "--privileged", "-sn", subnet);
//        log.info("=== RAW OUTPUT FASE 1 ===\n{}", phase1Output);
        List<String> liveIps = extractLiveIps(phase1Output);


        if (liveIps.isEmpty()) {
            log.warn("No se encontraron dispositivos activos.");
            return new ScanResult(phase1Output,"");
        }

        log.info("Fase 1 completada: {} dispositivos: {}", liveIps.size(), liveIps);

        List<String> phase2Command = new ArrayList<>(
                Arrays.asList("nmap", "--privileged", timingTemplate, "-Pn", "--send-ip", "--host-timeout", hostTimeout, "-sV"));
        phase2Command.addAll(liveIps);

        log.info("Fase 2: escaneo profundo de {} dispositivos", liveIps.size());
        String phase2Output = executeCommand(phase2Command.toArray(new String[0]));
//        log.info("=== RAW OUTPUT FASE 2 ===\n{}", phase2Output);

        return new ScanResult(phase1Output,phase2Output);
    }
    private void validateSubnet(String subnet) {
        if (subnet == null || !SUBNET_PATTERN.matcher(subnet).matches()) {
            log.error("Subred inválida rechazada: {}", subnet);
            throw new IllegalArgumentException("Formato de subred inválido: " + subnet);
        }
    }
    private List<String> extractLiveIps(String nmapOutput) {
        List<String> ips = new ArrayList<>();
        for (String line : nmapOutput.split("\n")) {
            if (line.startsWith("Nmap scan report for")) {
                String[] parts = line.split(" ");
                ips.add(parts[parts.length - 1].replace("(", "").replace(")", ""));
            }
        }
        return ips;
    }

    private String executeCommand(String... command) {
        try {
            ProcessBuilder builder = new ProcessBuilder(command);
            builder.redirectErrorStream(true);
            Process process = builder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String output = reader.lines().collect(Collectors.joining("\n"));

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                log.error("Comando falló (código {}): {}", exitCode, String.join(" ", command));
                throw new RuntimeException("Nmap terminó con código de error: " + exitCode);
            }
            return output;
        } catch (Exception e) {
            log.error("Error al ejecutar comando: ", e);
            throw new RuntimeException("No se pudo ejecutar el comando: " + e.getMessage());
        }
    }
}