package com.networkmonitor.dto;

import com.networkmonitor.model.Port;

import java.time.LocalDateTime;
import java.util.List;

public record DeviceResponseDTO(
        Long id,
        String ipAddress,
        String macAddress,
        String hostname,
        String friendlyName,
        String vendor,
        boolean known,
        boolean online,
        LocalDateTime firstSeen,
        LocalDateTime lastSeen,
        List<PortResponseDTO> ports
) { }
