package com.supportops.backend.repository;

import com.supportops.backend.entity.Incident;
import com.supportops.backend.enums.IncidentSeverity;
import com.supportops.backend.enums.IncidentStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IncidentRepository extends JpaRepository<Incident, String> {

    List<Incident> findByStatusOrderByStartedAtDesc(IncidentStatus status);

    long countBySeverity(IncidentSeverity severity);

    long countByStatus(IncidentStatus status);

    @EntityGraph(attributePaths = {"owner", "linkedTickets", "linkedTickets.customer"})
    @Query("""
            select distinct incident
            from Incident incident
            left join incident.owner owner
            left join incident.linkedTickets linkedTicket
            left join linkedTicket.customer customer
            where (:q = '' or lower(incident.id) like concat('%', :q, '%')
                or lower(incident.title) like concat('%', :q, '%')
                or lower(incident.affectedService) like concat('%', :q, '%'))
              and (:severity is null or incident.severity = :severity)
              and (:status is null or incident.status = :status)
            order by incident.startedAt desc
            """)
    List<Incident> searchIncidents(
            @Param("q") String q,
            @Param("severity") IncidentSeverity severity,
            @Param("status") IncidentStatus status
    );

    @EntityGraph(attributePaths = {"owner", "linkedTickets", "linkedTickets.customer"})
    @Query("""
            select distinct incident
            from Incident incident
            left join incident.owner owner
            left join incident.linkedTickets linkedTicket
            left join linkedTicket.customer customer
            where incident.id = :id
            """)
    Optional<Incident> findDetailedById(@Param("id") String id);
}
