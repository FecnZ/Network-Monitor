package com.networkmonitor.repository;

import com.networkmonitor.model.Alert;
import com.networkmonitor.model.Device;
import com.networkmonitor.notification.AlertType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    Optional<Alert> findFirstByDeviceAndTypeAndNotifiedTrueOrderByCreatedAtDesc(Device device, AlertType type);


}
