package com.networkmonitor.service;

import com.networkmonitor.dto.DeviceResponseDTO;
import com.networkmonitor.mappers.DeviceMapper;
import com.networkmonitor.repository.DeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class DeviceQueryService {
    private final DeviceRepository deviceRepository;
    private final DeviceMapper deviceMapper;

    public List<DeviceResponseDTO> getAllDevices() {
        return deviceRepository.findAll().stream()
                .map(deviceMapper::toDto)
                .toList();
    }

    public Optional<DeviceResponseDTO> getDeviceById(Long id) {
        return deviceRepository.findById(id).map(deviceMapper::toDto);
    }

    public List<DeviceResponseDTO> getOnlineDevices() {
        return deviceRepository.findByOnlineTrue().stream()
                .map(deviceMapper::toDto)
                .toList();
    }

    public Optional<DeviceResponseDTO> updateFriendlyName(Long id, String friendlyName) {
        return deviceRepository.findById(id).map(device -> {
            device.setFriendlyName(friendlyName);
            deviceRepository.save(device);
            return deviceMapper.toDto(device);
        });
    }
}
