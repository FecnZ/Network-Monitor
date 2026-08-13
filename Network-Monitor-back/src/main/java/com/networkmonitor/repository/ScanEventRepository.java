package com.networkmonitor.repository;

import com.networkmonitor.model.ScanEvent;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ScanEventRepository extends JpaRepository<ScanEvent, Long> {

    List<ScanEvent> findByDeviceIdOrderByTimestampDesc(Long deviceId, Pageable pageable);
    Optional<ScanEvent> findTopByDeviceIdOrderByTimestampDesc(Long deviceId);
    List<ScanEvent> findByDeviceIdInOrderByTimestampDesc(List<Long> deviceIds);

}