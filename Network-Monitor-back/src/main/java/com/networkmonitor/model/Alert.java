package com.networkmonitor.model;

import com.networkmonitor.notification.AlertType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Alert {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Device device;

    @Enumerated(EnumType.STRING)
    private AlertType type; // enum: UNKNOWN_DEVICE, DEVICE_OFFLINE, etc.

    private LocalDateTime createdAt;
    private boolean notified;


}