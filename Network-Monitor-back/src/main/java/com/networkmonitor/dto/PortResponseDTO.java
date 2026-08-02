package com.networkmonitor.dto;

public record PortResponseDTO (
    int numberPort,
    String protocol,
    String service,
    String state
) {}
