package com.networkmonitor.repository;

import com.networkmonitor.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {

    Optional<Device> findByIpAddress(String ipAddress);
    Optional<Device> findByMacAddress(String macAddress);
    Optional<Device> findByHostName(String deviceName);
    List<Device> findByOnlineTrueAndMacAddressIsNotNull();
    List<Device> findByOnlineTrueAndMacAddressIsNotNullAndMacAddressNotIn(List<String> macAddresses);
    List<Device> findByOnlineTrue();

}
