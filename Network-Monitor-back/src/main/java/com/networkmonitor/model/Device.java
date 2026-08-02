package com.networkmonitor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "Devices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ipAddress;

    @Column(unique = true)
    private String macAddress;

    private String hostName;
    private String vendor;
    private String friendlyName;
    private boolean known;
    private LocalDateTime firstSeen;
    private LocalDateTime lastSeen;
    private boolean online;

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Port> ports = new ArrayList<>();
}
