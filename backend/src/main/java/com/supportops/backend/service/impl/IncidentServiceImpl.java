package com.supportops.backend.service.impl;

import com.supportops.backend.dto.incident.CreateIncidentRequest;
import com.supportops.backend.dto.incident.IncidentDetailResponse;
import com.supportops.backend.dto.incident.IncidentQuery;
import com.supportops.backend.dto.incident.IncidentSummaryResponse;
import com.supportops.backend.dto.incident.UpdateIncidentRequest;
import com.supportops.backend.entity.Incident;
import com.supportops.backend.entity.Ticket;
import com.supportops.backend.entity.User;
import com.supportops.backend.enums.IncidentSeverity;
import com.supportops.backend.enums.IncidentStatus;
import com.supportops.backend.exception.BadRequestException;
import com.supportops.backend.exception.ResourceNotFoundException;
import com.supportops.backend.mapper.IncidentMapper;
import com.supportops.backend.enums.NotificationType;
import com.supportops.backend.repository.IncidentRepository;
import com.supportops.backend.repository.TicketRepository;
import com.supportops.backend.repository.UserRepository;
import com.supportops.backend.service.ActivityLogService;
import com.supportops.backend.service.IncidentService;
import com.supportops.backend.service.NotificationService;
import com.supportops.backend.utils.QueryUtils;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository incidentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;
    private final IncidentMapper incidentMapper;

    public IncidentServiceImpl(
            IncidentRepository incidentRepository,
            TicketRepository ticketRepository,
            UserRepository userRepository,
            ActivityLogService activityLogService,
            NotificationService notificationService,
            IncidentMapper incidentMapper
    ) {
        this.incidentRepository = incidentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.activityLogService = activityLogService;
        this.notificationService = notificationService;
        this.incidentMapper = incidentMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentSummaryResponse> getIncidents(IncidentQuery query) {
        String normalizedQuery = QueryUtils.normalizeSearch(query.q());
        IncidentSeverity severity = parseSeverity(query.severity());
        IncidentStatus status = parseStatus(query.status());

        return incidentRepository.searchIncidents(normalizedQuery, severity, status).stream()
                .sorted(Comparator.comparing(Incident::getStartedAt).reversed())
                .map(incidentMapper::toSummary)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public IncidentDetailResponse getIncident(String id) {
        Incident incident = getIncidentEntity(id);
        return incidentMapper.toDetail(incident, activityLogService.getTimeline("INCIDENT", incident.getId()));
    }

    @Override
    @Transactional
    public IncidentSummaryResponse createIncident(CreateIncidentRequest request) {
        User owner = userRepository.findById(request.ownerId())
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found."));

        Incident incident = new Incident();
        incident.setId(nextIncidentId());
        incident.setTitle(request.title());
        incident.setAffectedService(request.affectedService());
        incident.setSeverity(request.severity());
        incident.setStatus(request.status());
        incident.setOwner(owner);
        incident.setSummary(request.summary());
        incident.setRootCause(request.rootCause());
        incident.setMitigation(request.mitigation());
        incident.setStartedAt(request.startedAt());

        Incident saved = incidentRepository.save(incident);
        syncLinkedTickets(saved, request.linkedTicketIds(), owner.getFullName());

        activityLogService.log(
                "INCIDENT",
                saved.getId(),
                "CREATED",
                "Incident declared for " + saved.getAffectedService() + ".",
                owner.getFullName()
        );
        notificationService.create(
                owner,
                NotificationType.INCIDENT_CREATED,
                "Incident declared",
                saved.getId() + " was declared for " + saved.getAffectedService() + ".",
                "/incidents"
        );
        return incidentMapper.toSummary(saved);
    }

    @Override
    @Transactional
    public IncidentSummaryResponse updateIncident(String id, UpdateIncidentRequest request) {
        Incident incident = getIncidentEntity(id);

        if (request.title() == null && request.affectedService() == null && request.severity() == null && request.status() == null
                && request.ownerId() == null && request.summary() == null && request.rootCause() == null
                && request.mitigation() == null && request.startedAt() == null && request.resolvedAt() == null
                && request.linkedTicketIds() == null) {
            throw new BadRequestException("At least one incident field must be provided for update.");
        }

        if (request.ownerId() != null && !request.ownerId().isBlank()) {
            User owner = userRepository.findById(request.ownerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Owner not found."));
            incident.setOwner(owner);
        }
        if (request.title() != null && !request.title().isBlank()) incident.setTitle(request.title());
        if (request.affectedService() != null && !request.affectedService().isBlank()) incident.setAffectedService(request.affectedService());
        if (request.severity() != null) incident.setSeverity(request.severity());
        if (request.status() != null) incident.setStatus(request.status());
        if (request.summary() != null && !request.summary().isBlank()) incident.setSummary(request.summary());
        if (request.rootCause() != null && !request.rootCause().isBlank()) incident.setRootCause(request.rootCause());
        if (request.mitigation() != null && !request.mitigation().isBlank()) incident.setMitigation(request.mitigation());
        if (request.startedAt() != null) incident.setStartedAt(request.startedAt());
        if (request.resolvedAt() != null) incident.setResolvedAt(request.resolvedAt());

        Incident saved = incidentRepository.save(incident);
        syncLinkedTickets(saved, request.linkedTicketIds(), saved.getOwner().getFullName());

        activityLogService.log(
                "INCIDENT",
                saved.getId(),
                "UPDATED",
                "Incident details updated for " + saved.getAffectedService() + ".",
                saved.getOwner().getFullName()
        );
        if (saved.getResolvedAt() != null) {
            notificationService.create(
                    saved.getOwner(),
                    NotificationType.INCIDENT_RESOLVED,
                    "Incident resolved",
                    saved.getId() + " is marked resolved and ready for closeout review.",
                    "/incidents"
            );
        }
        return incidentMapper.toSummary(saved);
    }

    private Incident getIncidentEntity(String id) {
        return incidentRepository.findDetailedById(id)
                .or(() -> incidentRepository.findById(id))
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found."));
    }

    private IncidentSeverity parseSeverity(String severity) {
        if (QueryUtils.isBlank(severity)) {
            return null;
        }

        try {
            return IncidentSeverity.valueOf(severity.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new BadRequestException("Invalid incident severity filter.");
        }
    }

    private IncidentStatus parseStatus(String status) {
        if (QueryUtils.isBlank(status)) {
            return null;
        }

        try {
            return IncidentStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new BadRequestException("Invalid incident status filter.");
        }
    }

    private void syncLinkedTickets(Incident incident, List<String> linkedTicketIds, String actorName) {
        if (linkedTicketIds == null) {
            return;
        }

        Set<String> targetIds = new HashSet<>(linkedTicketIds);
        List<Ticket> currentlyLinked = new ArrayList<>(ticketRepository.findByRelatedIncidentIdOrderByUpdatedAtDesc(incident.getId()));

        for (Ticket ticket : currentlyLinked) {
            if (!targetIds.contains(ticket.getId())) {
                ticket.setRelatedIncident(null);
                ticketRepository.save(ticket);
                activityLogService.log("TICKET", ticket.getId(), "INCIDENT_LINKED",
                        "Incident link removed from ticket.", actorName);
            }
        }

        if (targetIds.isEmpty()) {
            return;
        }

        List<Ticket> targetTickets = ticketRepository.findAllById(targetIds);
        if (targetTickets.size() != targetIds.size()) {
            throw new ResourceNotFoundException("One or more linked tickets could not be found.");
        }

        for (Ticket ticket : targetTickets) {
            ticket.setRelatedIncident(incident);
            ticketRepository.save(ticket);
            activityLogService.log("TICKET", ticket.getId(), "INCIDENT_LINKED",
                    "Ticket linked to incident " + incident.getId() + " (" + incident.getTitle() + ").", actorName);
        }
    }

    private String nextIncidentId() {
        int next = incidentRepository.findAll().stream()
                .map(Incident::getId)
                .filter(id -> id != null && id.startsWith("INC-"))
                .map(id -> id.substring(4))
                .mapToInt(value -> {
                    try {
                        return Integer.parseInt(value);
                    } catch (NumberFormatException ex) {
                        return 900;
                    }
                })
                .max()
                .orElse(900) + 1;
        return "INC-" + next;
    }
}
