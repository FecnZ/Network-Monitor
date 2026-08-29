package com.networkmonitor.service;

import com.networkmonitor.model.Alert;
import com.networkmonitor.model.Device;
import com.networkmonitor.notification.AlertType;
import com.networkmonitor.notification.NotificationSender;
import com.networkmonitor.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlertService {

    private final AlertRepository alertRepository;
    private final NotificationSender notificationSender;

    public void evaluate(Device device, boolean isNewDevice) {
        if (!isNewDevice || device.isKnown()) {
            return; // no es candidato a alerta: ya existía, o es un dispositivo ya reconocido
        }


        boolean present = alertRepository
                .findFirstByDeviceAndTypeAndNotifiedTrueOrderByCreatedAtDesc(device, AlertType.UNKNOWN_DEVICE)
                .isPresent();

        if (present) {
            log.debug("Ya existe alerta activa para dispositivo {}, no se reenvía (RF-13)", device.getIpAddress());
            return;
        }

        Alert alert = new Alert();
        alert.setDevice(device);
        alert.setType(AlertType.UNKNOWN_DEVICE);
        alert.setCreatedAt(LocalDateTime.now());
        alert.setNotified(true);
        alertRepository.save(alert);

        String mensaje = " Dispositivo desconocido detectado\nIP: %s\nMAC: %s\nVendor: %s".formatted(
                device.getIpAddress(),
                device.getMacAddress() != null ? device.getMacAddress() : "N/A",
                device.getVendor() != null ? device.getVendor() : "N/A"
        );
        notificationSender.send(mensaje);
    }
}

