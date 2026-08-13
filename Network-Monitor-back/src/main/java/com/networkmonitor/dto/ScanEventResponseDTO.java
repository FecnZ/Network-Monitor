package com.networkmonitor.dto;

import java.time.LocalDateTime;

public record ScanEventResponseDTO(
        Long id,
        LocalDateTime timestamp,
        boolean online
) {}