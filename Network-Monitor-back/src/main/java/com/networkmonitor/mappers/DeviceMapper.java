package com.networkmonitor.mappers;

import com.networkmonitor.dto.DeviceResponseDTO;
import com.networkmonitor.dto.PortResponseDTO;
import com.networkmonitor.model.Device;
import org.springframework.stereotype.Component;

import java.util.List;
@Component
public class DeviceMapper {
    public DeviceResponseDTO toDto(Device device) {
        List<PortResponseDTO> ports = device.getPorts().stream()
                .map(p -> new PortResponseDTO(p.getPortNumber(), p.getProtocol(), p.getService(), p.getState()))
                .toList();
        return new DeviceResponseDTO(device.getId(), device.getIpAddress(), device.getMacAddress(),
                device.getHostName(), device.getFriendlyName(), device.getVendor(), device.isKnown(),
                device.isOnline(), device.getFirstSeen(), device.getLastSeen(), ports);
    }
}
