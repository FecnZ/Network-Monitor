package com.networkmonitor.scanner;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.networkmonitor.scanner.xml.NmapHost;
import com.networkmonitor.scanner.xml.NmapRun;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
public class ScannerService {

    private static final Pattern SUBNET_PATTERN =
            Pattern.compile("^(\\d{1,3}\\.){3}\\d{1,3}(/\\d{1,2})?$");

    @Value("${networkmonitor.scan.timing-template}")
    private String timingTemplate;

    @Value("${networkmonitor.scan.host-timeout}")
    private String hostTimeout;

    private final XmlMapper xmlMapper;

    public ScanResult runFullScan(String subnet) {
        validateSubnet(subnet);

        Path phase1Xml = createTempXmlFile("nmap-phase1");
        Path phase2Xml = createTempXmlFile("nmap-phase2");

        try {
            log.info("Fase 1: descubrimiento en {}", subnet);
            executeCommand("nmap", "--privileged", "-sn", "-oX", phase1Xml.toString(), subnet);
            String phase1Content = readAndDelete(phase1Xml);

            List<String> liveIps = extractLiveIps(phase1Content);
            if (liveIps.isEmpty()) {
                log.warn("No se encontraron dispositivos activos.");
                return new ScanResult(phase1Content, "");
            }

            log.info("Fase 1 completada: {} dispositivos: {}", liveIps.size(), liveIps);

            List<String> phase2Command = new ArrayList<>(Arrays.asList(
                    "nmap", "--privileged", timingTemplate, "-Pn", "--send-ip",
                    "--host-timeout", hostTimeout, "-sV",
                    "-oX", phase2Xml.toString()));
            phase2Command.addAll(liveIps);

            log.info("Fase 2: escaneo profundo de {} dispositivos", liveIps.size());
            executeCommand(phase2Command.toArray(new String[0]));
            String phase2Content = readAndDelete(phase2Xml);

            return new ScanResult(phase1Content, phase2Content);
        } finally {
            deleteIfExists(phase1Xml);
            deleteIfExists(phase2Xml);
        }
    }

    private Path createTempXmlFile(String prefix) {
        try {
            return Files.createTempFile(prefix, ".xml");
        } catch (IOException e) {
            throw new RuntimeException("No se pudo crear archivo temporal para Nmap: " + e.getMessage(), e);
        }
    }

    private String readAndDelete(Path path) {
        try {
            String content = Files.readString(path);
            Files.deleteIfExists(path);
            return content;
        } catch (IOException e) {
            throw new RuntimeException("No se pudo leer el XML generado por Nmap: " + e.getMessage(), e);
        }
    }

    private void deleteIfExists(Path path) {
        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.warn("No se pudo eliminar archivo temporal {}: {}", path, e.getMessage());
        }
    }

    private void validateSubnet(String subnet) {
        if (subnet == null || !SUBNET_PATTERN.matcher(subnet).matches()) {
            log.error("Subred inválida rechazada: {}", subnet);
            throw new IllegalArgumentException("Formato de subred inválido: " + subnet);
        }
    }

    /**
     * Extrae IPs vivas directamente del XML de la Fase 1 (más confiable que buscar texto).
     */
    private List<String> extractLiveIps(String xmlContent) {
        try {
            NmapRun run = xmlMapper.readValue(xmlContent, NmapRun.class);
            if (run.getHosts() == null) return List.of();

            return run.getHosts().stream()
                    .filter(NmapHost::isUp)
                    .map(NmapHost::getIpAddress)
                    .filter(Objects::nonNull)
                    .toList();
        } catch (Exception e) {
            log.error("Error al parsear XML de Fase 1: ", e);
            return List.of();
        }
    }

    private void executeCommand(String... command) {
        try {
            ProcessBuilder builder = new ProcessBuilder(command);
            builder.redirectErrorStream(true);
            // Ya no necesitamos leer stdout para el resultado (va al archivo XML),
            // pero sí vaciar el stream para evitar que el buffer se llene y bloquee el proceso.
            Process process = builder.start();
            process.getInputStream().readAllBytes();

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                log.error("Comando falló (código {}): {}", exitCode, String.join(" ", command));
                throw new RuntimeException("Nmap terminó con código de error: " + exitCode);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Ejecución de Nmap interrumpida", e);
        } catch (IOException e) {
            log.error("Error al ejecutar comando: ", e);
            throw new RuntimeException("No se pudo ejecutar el comando: " + e.getMessage(), e);
        }
    }
}