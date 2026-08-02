package com.networkmonitor.repository;

import com.networkmonitor.model.Port;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortRepository extends JpaRepository<Port, Long> {

    List<Port> findByDevice_Id(Long deviceId);
}
