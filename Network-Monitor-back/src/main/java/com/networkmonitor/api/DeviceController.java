package com.networkmonitor.api;

import com.networkmonitor.dto.DeviceResponseDTO;
import com.networkmonitor.dto.UpdateFriendlyNameRequest;
import com.networkmonitor.service.DeviceQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceQueryService deviceQueryService;


    @GetMapping
    public ResponseEntity<List<DeviceResponseDTO>> getDevices() {
        return ResponseEntity.ok(deviceQueryService.getAllDevices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviceResponseDTO> getDeviceById(@PathVariable Long id) {
        return deviceQueryService.getDeviceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/online")
    public ResponseEntity<List<DeviceResponseDTO>> getOnlineDevices() {
        return ResponseEntity.ok(deviceQueryService.getOnlineDevices());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<DeviceResponseDTO> updateFriendlyName(
            @PathVariable Long id,
            @RequestBody UpdateFriendlyNameRequest request) {

        return deviceQueryService.updateFriendlyName(id, request.friendlyName())
                .map(ResponseEntity :: ok)
                .orElse(ResponseEntity.notFound().build());

    }

}
