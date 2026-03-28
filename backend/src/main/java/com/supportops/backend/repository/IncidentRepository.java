package com.supportops.backend.repository;

import com.supportops.backend.entity.Incident;
import com.supportops.backend.enums.IncidentSeverity;
import com.supportops.backend.enums.IncidentStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidentRepository extends JpaRepository<Incident, String> {

    List<Incident> findByStatusOrderByStartedAtDesc(IncidentStatus status);

    long countBySeverity(IncidentSeverity severity);

    long countByStatus(IncidentStatus status);
}
