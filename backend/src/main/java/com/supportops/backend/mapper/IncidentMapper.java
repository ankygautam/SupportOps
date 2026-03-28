package com.supportops.backend.mapper;

import com.supportops.backend.dto.common.ActivityLogResponse;
import com.supportops.backend.dto.incident.IncidentDetailResponse;
import com.supportops.backend.dto.incident.IncidentSummaryResponse;
import com.supportops.backend.entity.Incident;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class IncidentMapper {

    public IncidentSummaryResponse toSummary(Incident incident) {
        return new IncidentSummaryResponse(
                incident.getId(),
                incident.getTitle(),
                incident.getAffectedService(),
                incident.getSeverity().name(),
                incident.getStatus().name(),
                incident.getOwner().getId(),
                incident.getOwner().getFullName(),
                incident.getLinkedTickets().size(),
                (int) incident.getLinkedTickets().stream().map(ticket -> ticket.getCustomer().getId()).distinct().count(),
                incident.getStartedAt(),
                incident.getResolvedAt(),
                incident.getCreatedAt(),
                incident.getUpdatedAt()
        );
    }

    public IncidentDetailResponse toDetail(Incident incident, List<ActivityLogResponse> timeline) {
        return new IncidentDetailResponse(
                incident.getId(),
                incident.getTitle(),
                incident.getAffectedService(),
                incident.getSeverity().name(),
                incident.getStatus().name(),
                incident.getOwner().getId(),
                incident.getOwner().getFullName(),
                incident.getSummary(),
                incident.getRootCause(),
                incident.getMitigation(),
                incident.getLinkedTickets().stream().map(ticket -> ticket.getId()).toList(),
                (int) incident.getLinkedTickets().stream().map(ticket -> ticket.getCustomer().getId()).distinct().count(),
                incident.getStartedAt(),
                incident.getResolvedAt(),
                incident.getCreatedAt(),
                incident.getUpdatedAt(),
                timeline
        );
    }
}
