package com.supportops.backend.service.impl;

import com.supportops.backend.dto.ticket.CreateTicketCommentRequest;
import com.supportops.backend.dto.ticket.CreateTicketRequest;
import com.supportops.backend.dto.ticket.TicketCommentResponse;
import com.supportops.backend.dto.ticket.TicketDetailResponse;
import com.supportops.backend.dto.ticket.TicketQuery;
import com.supportops.backend.dto.ticket.TicketSummaryResponse;
import com.supportops.backend.dto.ticket.TicketUpdateRequest;
import com.supportops.backend.entity.Customer;
import com.supportops.backend.entity.Incident;
import com.supportops.backend.entity.SlaRecord;
import com.supportops.backend.entity.Ticket;
import com.supportops.backend.entity.TicketComment;
import com.supportops.backend.entity.User;
import com.supportops.backend.enums.RoleType;
import com.supportops.backend.enums.NotificationType;
import com.supportops.backend.enums.SlaState;
import com.supportops.backend.enums.TicketPriority;
import com.supportops.backend.enums.TicketStatus;
import com.supportops.backend.exception.BadRequestException;
import com.supportops.backend.exception.ResourceNotFoundException;
import com.supportops.backend.mapper.TicketMapper;
import com.supportops.backend.repository.CustomerRepository;
import com.supportops.backend.repository.IncidentRepository;
import com.supportops.backend.repository.SlaRecordRepository;
import com.supportops.backend.repository.TicketCommentRepository;
import com.supportops.backend.repository.TicketRepository;
import com.supportops.backend.repository.UserRepository;
import com.supportops.backend.service.ActivityLogService;
import com.supportops.backend.service.NotificationService;
import com.supportops.backend.service.TicketService;
import com.supportops.backend.utils.QueryUtils;
import com.supportops.backend.utils.badges.TicketSlaResolver;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final IncidentRepository incidentRepository;
    private final SlaRecordRepository slaRecordRepository;
    private final TicketCommentRepository ticketCommentRepository;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;
    private final TicketMapper ticketMapper;

    public TicketServiceImpl(
            TicketRepository ticketRepository,
            CustomerRepository customerRepository,
            UserRepository userRepository,
            IncidentRepository incidentRepository,
            SlaRecordRepository slaRecordRepository,
            TicketCommentRepository ticketCommentRepository,
            ActivityLogService activityLogService,
            NotificationService notificationService,
            TicketMapper ticketMapper
    ) {
        this.ticketRepository = ticketRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.incidentRepository = incidentRepository;
        this.slaRecordRepository = slaRecordRepository;
        this.ticketCommentRepository = ticketCommentRepository;
        this.activityLogService = activityLogService;
        this.notificationService = notificationService;
        this.ticketMapper = ticketMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketSummaryResponse> getTickets(TicketQuery query) {
        String normalizedQuery = QueryUtils.normalizeSearch(query.q());
        TicketStatus status = parseTicketStatus(query.status());
        TicketPriority priority = parseTicketPriority(query.priority());
        SlaState slaState = parseSlaState(query.slaState());

        return ticketRepository.searchTickets(
                        normalizedQuery,
                        status,
                        priority,
                        QueryUtils.isBlank(query.assignedAgentId()) ? null : query.assignedAgentId().trim(),
                        QueryUtils.isBlank(query.customerId()) ? null : query.customerId().trim(),
                        slaState
                ).stream()
                .sorted(Comparator.comparing(Ticket::getUpdatedAt).reversed())
                .map(ticket -> ticketMapper.toSummary(ticket, ticket.getSlaRecord()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TicketDetailResponse getTicket(String id) {
        Ticket ticket = getTicketEntity(id);
        return ticketMapper.toDetail(ticket, ticket.getSlaRecord(), getComments(id), activityLogService.getTimeline("TICKET", id));
    }

    @Override
    @Transactional
    public TicketSummaryResponse createTicket(CreateTicketRequest request) {
        Customer customer = resolveCustomer(request.customerId());
        User assignedAgent = resolveRequiredAssignedAgent(request.assignedAgentId());
        Incident relatedIncident = resolveIncident(request.relatedIncidentId());

        Ticket ticket = ticketMapper.toEntity(request, nextTicketId(), customer, assignedAgent, relatedIncident);
        applyStatusSideEffects(ticket, null, request.status(), null, null);
        Ticket savedTicket = ticketRepository.save(ticket);
        SlaRecord slaRecord = upsertSlaRecord(savedTicket, null);
        savedTicket.setSlaRecord(slaRecord);

        String actorName = currentUserDisplayNameOr(assignedAgent.getFullName());
        activityLogService.log("TICKET", savedTicket.getId(), "CREATED",
                "Ticket created and assigned to " + assignedAgent.getFullName() + ".", actorName);
        notificationService.create(
                assignedAgent,
                NotificationType.TICKET_ASSIGNED,
                "Ticket assigned to you",
                savedTicket.getId() + " was routed into your queue for follow-up.",
                "/tickets/" + savedTicket.getId()
        );
        if (relatedIncident != null) {
            activityLogService.log("TICKET", savedTicket.getId(), "INCIDENT_LINKED",
                    "Ticket linked to incident " + relatedIncident.getId() + " (" + relatedIncident.getTitle() + ").", actorName);
        }
        if (savedTicket.getWaitingSince() != null) {
            logEvent(savedTicket, "WAITING_ON_CUSTOMER", "Ticket is waiting on customer confirmation or data.", actorName);
        }

        return ticketMapper.toSummary(savedTicket, slaRecord);
    }

    @Override
    @Transactional
    public TicketSummaryResponse updateTicket(String id, TicketUpdateRequest request) {
        validateUpdateRequest(request);

        Ticket ticket = getTicketEntity(id);
        User currentUser = currentUser();
        Incident previousIncident = ticket.getRelatedIncident();
        User previousAgent = ticket.getAssignedAgent();
        TicketStatus previousStatus = ticket.getStatus();
        String previousSubject = ticket.getSubject();
        String previousDescription = ticket.getDescription();
        String previousEscalatedToTeam = ticket.getEscalatedToTeam();
        String previousEscalationReason = ticket.getEscalationReason();
        Instant previousDueAt = ticket.getDueAt();
        SlaState previousSlaState = ticket.getSlaRecord() != null ? ticket.getSlaRecord().getState() : null;

        User assignedAgent = resolveAssignedAgent(request.assignedAgentId(), ticket.getAssignedAgent());
        Incident relatedIncident = resolveUpdatedIncident(request.relatedIncidentId(), ticket.getRelatedIncident());

        ticketMapper.applyUpdate(ticket, request, assignedAgent, relatedIncident);
        applyWorkflowRules(ticket, previousStatus, request, currentUser);
        Ticket updatedTicket = ticketRepository.save(ticket);
        SlaRecord slaRecord = upsertSlaRecord(updatedTicket, updatedTicket.getSlaRecord());
        updatedTicket.setSlaRecord(slaRecord);

        logTicketUpdateEvents(
                updatedTicket,
                currentUser,
                previousStatus,
                previousAgent,
                previousIncident,
                previousEscalatedToTeam,
                previousEscalationReason,
                previousSubject,
                previousDescription,
                previousDueAt
        );
        if (updatedTicket.getAssignedAgent() != null && slaRecord.getState() == SlaState.BREACHED && previousSlaState != SlaState.BREACHED) {
            notificationService.create(
                    updatedTicket.getAssignedAgent(),
                    NotificationType.SLA_BREACHED,
                    "SLA breached",
                    updatedTicket.getId() + " has breached its resolution target and needs immediate action.",
                    "/tickets/" + updatedTicket.getId()
            );
        }

        return ticketMapper.toSummary(updatedTicket, slaRecord);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketCommentResponse> getComments(String ticketId) {
        getTicketEntity(ticketId);
        return ticketCommentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId).stream()
                .map(ticketMapper::toCommentResponse)
                .toList();
    }

    @Override
    @Transactional
    public TicketCommentResponse addComment(String ticketId, CreateTicketCommentRequest request) {
        Ticket ticket = getTicketEntity(ticketId);
        User currentUser = currentUser();

        TicketComment comment = new TicketComment();
        comment.setTicket(ticket);
        comment.setAuthor(currentUser);
        comment.setContent(request.content());
        comment.setInternalNote(request.internalNote());

        TicketComment savedComment = ticketCommentRepository.save(comment);

        activityLogService.log(
                "TICKET",
                ticket.getId(),
                request.internalNote() ? "INTERNAL_NOTE" : "PUBLIC_REPLY",
                request.internalNote() ? "Internal note added to ticket." : "Public reply added to ticket.",
                currentUser.getFullName()
        );

        return ticketMapper.toCommentResponse(savedComment);
    }

    private void validateUpdateRequest(TicketUpdateRequest request) {
        boolean noChangePayload = (request.subject() == null || request.subject().isBlank())
                && (request.description() == null || request.description().isBlank())
                && request.status() == null
                && request.priority() == null
                && request.assignedAgentId() == null
                && request.relatedIncidentId() == null
                && request.escalatedToTeam() == null
                && request.escalationReason() == null
                && request.resolutionSummary() == null
                && request.closeNotes() == null
                && request.reopenReason() == null
                && request.dueAt() == null;

        if (noChangePayload) {
            throw new BadRequestException("At least one ticket field must be provided for update.");
        }
    }

    private void applyWorkflowRules(Ticket ticket, TicketStatus previousStatus, TicketUpdateRequest request, User currentUser) {
        if ((request.escalatedToTeam() != null && !request.escalatedToTeam().isBlank())
                || (request.escalationReason() != null && !request.escalationReason().isBlank())) {
            if (request.escalatedToTeam() == null || request.escalatedToTeam().isBlank()) {
                throw new BadRequestException("Escalated team is required when escalating a ticket.");
            }
            if (request.escalationReason() == null || request.escalationReason().isBlank()) {
                throw new BadRequestException("Escalation reason is required when escalating a ticket.");
            }
            ticket.setEscalatedAt(Instant.now());
        } else if ((request.escalatedToTeam() != null || request.escalationReason() != null)
                && (request.escalatedToTeam() == null || request.escalatedToTeam().isBlank())
                && (request.escalationReason() == null || request.escalationReason().isBlank())) {
            ticket.setEscalatedToTeam(null);
            ticket.setEscalationReason(null);
            ticket.setEscalatedAt(null);
        }

        applyStatusSideEffects(ticket, previousStatus, ticket.getStatus(), request.resolutionSummary(), request.reopenReason());

        if (ticket.getStatus() == TicketStatus.CLOSED
                && previousStatus != TicketStatus.RESOLVED
                && previousStatus != TicketStatus.CLOSED
                && currentUser.getRole().getName() != RoleType.ADMIN) {
            throw new BadRequestException("Tickets must be resolved before they can be closed.");
        }

        if (ticket.getStatus() == TicketStatus.RESOLVED
                && (ticket.getResolutionSummary() == null || ticket.getResolutionSummary().isBlank())) {
            throw new BadRequestException("Resolution summary is required when resolving a ticket.");
        }

        if ((previousStatus == TicketStatus.RESOLVED || previousStatus == TicketStatus.CLOSED)
                && ticket.getStatus() != TicketStatus.RESOLVED
                && ticket.getStatus() != TicketStatus.CLOSED) {
            if (request.reopenReason() == null || request.reopenReason().isBlank()) {
                throw new BadRequestException("Reopen reason is required when reopening a resolved ticket.");
            }
            ticket.setReopenedAt(Instant.now());
            ticket.setResolvedAt(null);
        }

        if (ticket.getStatus() == TicketStatus.CLOSED && ticket.getResolvedAt() == null) {
            ticket.setResolvedAt(Instant.now());
        }
    }

    private void applyStatusSideEffects(
            Ticket ticket,
            TicketStatus previousStatus,
            TicketStatus nextStatus,
            String resolutionSummary,
            String reopenReason
    ) {
        if (nextStatus == TicketStatus.WAITING_ON_CUSTOMER) {
            if (ticket.getWaitingSince() == null) {
                ticket.setWaitingSince(Instant.now());
            }
        } else {
            ticket.setWaitingSince(null);
        }

        if (nextStatus == TicketStatus.RESOLVED) {
            if (resolutionSummary != null && !resolutionSummary.isBlank()) {
                ticket.setResolutionSummary(resolutionSummary.trim());
            }
            if (ticket.getResolvedAt() == null) {
                ticket.setResolvedAt(Instant.now());
            }
        }

        if ((previousStatus == TicketStatus.RESOLVED || previousStatus == TicketStatus.CLOSED)
                && nextStatus != TicketStatus.RESOLVED
                && nextStatus != TicketStatus.CLOSED
                && reopenReason != null && !reopenReason.isBlank()) {
            ticket.setReopenReason(reopenReason.trim());
        }
    }

    private void logTicketUpdateEvents(
            Ticket ticket,
            User actor,
            TicketStatus previousStatus,
            User previousAgent,
            Incident previousIncident,
            String previousEscalatedToTeam,
            String previousEscalationReason,
            String previousSubject,
            String previousDescription,
            Instant previousDueAt
    ) {
        List<String> genericChanges = new ArrayList<>();

        if (previousAgent == null && ticket.getAssignedAgent() != null
                || previousAgent != null && ticket.getAssignedAgent() != null && !Objects.equals(previousAgent.getId(), ticket.getAssignedAgent().getId())) {
            activityLogService.log("TICKET", ticket.getId(), "ASSIGNED",
                    "Ticket assigned to " + ticket.getAssignedAgent().getFullName() + ".", actor.getFullName());
            if (ticket.getAssignedAgent() != null) {
                notifyAssignedAgent(ticket, "Ticket assigned to you", ticket.getId() + " is now owned by you.");
            }
        }

        if (!Objects.equals(previousStatus, ticket.getStatus())) {
            String action = switch (ticket.getStatus()) {
                case WAITING_ON_CUSTOMER -> "WAITING_ON_CUSTOMER";
                case RESOLVED -> "RESOLVED";
                case CLOSED -> "CLOSED";
                default -> "STATUS_CHANGED";
            };
            activityLogService.log("TICKET", ticket.getId(), action,
                    "Status changed from " + previousStatus.name() + " to " + ticket.getStatus().name() + ".", actor.getFullName());
        }

        if ((previousStatus == TicketStatus.RESOLVED || previousStatus == TicketStatus.CLOSED)
                && ticket.getStatus() != TicketStatus.RESOLVED
                && ticket.getStatus() != TicketStatus.CLOSED
                && ticket.getReopenedAt() != null) {
            activityLogService.log("TICKET", ticket.getId(), "REOPENED",
                    "Ticket reopened with reason: " + ticket.getReopenReason(), actor.getFullName());
        }

        if (ticket.getEscalatedAt() != null
                && (!Objects.equals(previousEscalatedToTeam, ticket.getEscalatedToTeam())
                || !Objects.equals(previousEscalationReason, ticket.getEscalationReason()))) {
            activityLogService.log("TICKET", ticket.getId(), "ESCALATED",
                    "Escalated to " + ticket.getEscalatedToTeam() + " because " + ticket.getEscalationReason(), actor.getFullName());
            if (ticket.getAssignedAgent() != null) {
                notifyEscalation(ticket);
            }
        }

        if (previousIncident == null && ticket.getRelatedIncident() != null
                || previousIncident != null && ticket.getRelatedIncident() != null && !Objects.equals(previousIncident.getId(), ticket.getRelatedIncident().getId())
                || previousIncident != null && ticket.getRelatedIncident() == null) {
            String description = ticket.getRelatedIncident() == null
                    ? "Incident link removed from the ticket."
                    : "Ticket linked to incident " + ticket.getRelatedIncident().getId() + " (" + ticket.getRelatedIncident().getTitle() + ").";
            activityLogService.log("TICKET", ticket.getId(), "INCIDENT_LINKED", description, actor.getFullName());
        }

        if (!Objects.equals(previousSubject, ticket.getSubject())) {
            genericChanges.add("subject updated");
        }
        if (!Objects.equals(previousDescription, ticket.getDescription())) {
            genericChanges.add("description updated");
        }
        if (!Objects.equals(previousDueAt, ticket.getDueAt())) {
            genericChanges.add("due date adjusted");
        }
        if (ticket.getResolutionSummary() != null && !ticket.getResolutionSummary().isBlank() && ticket.getStatus() == TicketStatus.RESOLVED) {
            genericChanges.add("resolution summary captured");
        }
        if (ticket.getCloseNotes() != null && !ticket.getCloseNotes().isBlank() && ticket.getStatus() == TicketStatus.CLOSED) {
            genericChanges.add("close notes captured");
        }

        if (!genericChanges.isEmpty()) {
            activityLogService.log("TICKET", ticket.getId(), "UPDATED",
                    "Ticket updated: " + String.join(", ", genericChanges) + ".", actor.getFullName());
        }
    }

    private Ticket getTicketEntity(String id) {
        return ticketRepository.findDetailedById(id)
                .or(() -> ticketRepository.findById(id))
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found."));
    }

    private TicketStatus parseTicketStatus(String status) {
        if (QueryUtils.isBlank(status)) {
            return null;
        }

        try {
            return TicketStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new BadRequestException("Invalid ticket status filter.");
        }
    }

    private TicketPriority parseTicketPriority(String priority) {
        if (QueryUtils.isBlank(priority)) {
            return null;
        }

        try {
            return TicketPriority.valueOf(priority.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new BadRequestException("Invalid ticket priority filter.");
        }
    }

    private SlaState parseSlaState(String state) {
        if (QueryUtils.isBlank(state)) {
            return null;
        }

        try {
            return SlaState.valueOf(state.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new BadRequestException("Invalid SLA filter.");
        }
    }

    private User resolveAssignedAgent(String assignedAgentId, User fallback) {
        if (assignedAgentId == null || assignedAgentId.isBlank()) {
            return fallback;
        }

        return resolveRequiredAssignedAgent(assignedAgentId);
    }

    private User resolveRequiredAssignedAgent(String assignedAgentId) {
        return userRepository.findById(assignedAgentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assigned agent not found."));
    }

    private Customer resolveCustomer(String customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found."));
    }

    private Incident resolveIncident(String incidentId) {
        if (incidentId == null || incidentId.isBlank()) {
            return null;
        }

        return incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found."));
    }

    private Incident resolveUpdatedIncident(String incidentId, Incident fallback) {
        if (incidentId == null) {
            return fallback;
        }
        if (incidentId.isBlank()) {
            return null;
        }
        return resolveIncident(incidentId);
    }

    private SlaRecord upsertSlaRecord(Ticket ticket, SlaRecord existingRecord) {
        Instant base = ticket.getCreatedAt() != null ? ticket.getCreatedAt() : Instant.now();
        long responseMinutes = responseTargetMinutes(ticket);
        long resolutionMinutes = resolutionTargetMinutes(ticket);

        SlaRecord record = existingRecord == null ? new SlaRecord() : existingRecord;
        record.setTicket(ticket);
        record.setFirstResponseTargetAt(base.plusSeconds(responseMinutes * 60));
        record.setResolutionTargetAt(base.plusSeconds(resolutionMinutes * 60));

        Instant now = Instant.now();
        SlaState state = record.getResolutionTargetAt().isBefore(now)
                ? SlaState.BREACHED
                : record.getResolutionTargetAt().minusSeconds(3600).isBefore(now)
                ? SlaState.DUE_SOON
                : SlaState.ON_TRACK;

        record.setState(state);
        record.setBreached(state == SlaState.BREACHED);
        return slaRecordRepository.save(record);
    }

    private long responseTargetMinutes(Ticket ticket) {
        return switch (ticket.getPriority()) {
            case CRITICAL -> 15;
            case HIGH -> 30;
            case MEDIUM -> 120;
            case LOW -> 240;
        };
    }

    private long resolutionTargetMinutes(Ticket ticket) {
        return switch (ticket.getPriority()) {
            case CRITICAL -> 240;
            case HIGH -> 480;
            case MEDIUM -> 960;
            case LOW -> 1440;
        };
    }

    private void notifyAssignedAgent(Ticket ticket, String title, String description) {
        if (ticket.getAssignedAgent() == null) {
            return;
        }

        notificationService.create(
                ticket.getAssignedAgent(),
                NotificationType.TICKET_ASSIGNED,
                title,
                description,
                "/tickets/" + ticket.getId()
        );
    }

    private void notifyEscalation(Ticket ticket) {
        if (ticket.getAssignedAgent() == null) {
            return;
        }

        notificationService.create(
                ticket.getAssignedAgent(),
                NotificationType.TICKET_ESCALATED,
                "Ticket escalated",
                ticket.getId() + " was escalated to " + ticket.getEscalatedToTeam() + ".",
                "/tickets/" + ticket.getId()
        );
    }

    private void logEvent(Ticket ticket, String action, String description, String actorName) {
        activityLogService.log("TICKET", ticket.getId(), action, description, actorName);
    }

    private String nextTicketId() {
        int next = ticketRepository.findAll().stream()
                .map(Ticket::getId)
                .filter(id -> id != null && id.startsWith("SUP-"))
                .map(id -> id.substring(4))
                .mapToInt(value -> {
                    try {
                        return Integer.parseInt(value);
                    } catch (NumberFormatException ex) {
                        return 3000;
                    }
                })
                .max()
                .orElse(3000) + 1;
        return "SUP-" + next;
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));
    }

    private String currentUserDisplayNameOr(String fallback) {
        try {
            return currentUser().getFullName();
        } catch (Exception ignored) {
            return fallback;
        }
    }
}
