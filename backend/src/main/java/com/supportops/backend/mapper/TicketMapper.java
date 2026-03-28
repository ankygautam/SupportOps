package com.supportops.backend.mapper;

import com.supportops.backend.dto.common.ActivityLogResponse;
import com.supportops.backend.dto.ticket.CreateTicketRequest;
import com.supportops.backend.dto.ticket.TicketCommentResponse;
import com.supportops.backend.dto.ticket.TicketDetailResponse;
import com.supportops.backend.dto.ticket.TicketSummaryResponse;
import com.supportops.backend.dto.ticket.TicketUpdateRequest;
import com.supportops.backend.entity.Customer;
import com.supportops.backend.entity.Incident;
import com.supportops.backend.entity.SlaRecord;
import com.supportops.backend.entity.Ticket;
import com.supportops.backend.entity.TicketComment;
import com.supportops.backend.entity.User;
import com.supportops.backend.utils.badges.TicketSlaResolver;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class TicketMapper {

    public Ticket toEntity(CreateTicketRequest request, String id, Customer customer, User assignedAgent, Incident relatedIncident) {
        Ticket ticket = new Ticket();
        ticket.setId(id);
        ticket.setSubject(request.subject());
        ticket.setDescription(request.description());
        ticket.setStatus(request.status());
        ticket.setPriority(request.priority());
        ticket.setCustomer(customer);
        ticket.setAssignedAgent(assignedAgent);
        ticket.setRelatedIncident(relatedIncident);
        ticket.setDueAt(request.dueAt());
        return ticket;
    }

    public void applyUpdate(Ticket ticket, TicketUpdateRequest request, User assignedAgent, Incident relatedIncident) {
        if (request.subject() != null && !request.subject().isBlank()) {
            ticket.setSubject(request.subject());
        }
        if (request.description() != null && !request.description().isBlank()) {
            ticket.setDescription(request.description());
        }
        if (request.status() != null) {
            ticket.setStatus(request.status());
        }
        if (request.priority() != null) {
            ticket.setPriority(request.priority());
        }
        if (assignedAgent != null) {
            ticket.setAssignedAgent(assignedAgent);
        }
        if (request.relatedIncidentId() != null) {
            ticket.setRelatedIncident(relatedIncident);
        }
        if (request.escalatedToTeam() != null) {
            ticket.setEscalatedToTeam(request.escalatedToTeam().isBlank() ? null : request.escalatedToTeam().trim());
        }
        if (request.escalationReason() != null) {
            ticket.setEscalationReason(request.escalationReason().isBlank() ? null : request.escalationReason().trim());
        }
        if (request.resolutionSummary() != null) {
            ticket.setResolutionSummary(request.resolutionSummary().isBlank() ? null : request.resolutionSummary().trim());
        }
        if (request.closeNotes() != null) {
            ticket.setCloseNotes(request.closeNotes().isBlank() ? null : request.closeNotes().trim());
        }
        if (request.reopenReason() != null) {
            ticket.setReopenReason(request.reopenReason().isBlank() ? null : request.reopenReason().trim());
        }
        if (request.dueAt() != null) {
            ticket.setDueAt(request.dueAt());
        }
    }

    public TicketSummaryResponse toSummary(Ticket ticket, SlaRecord slaRecord) {
        return new TicketSummaryResponse(
                ticket.getId(),
                ticket.getSubject(),
                ticket.getDescription(),
                ticket.getStatus().name(),
                ticket.getPriority().name(),
                ticket.getCustomer().getId(),
                ticket.getCustomer().getName(),
                ticket.getCustomer().getCompany(),
                ticket.getAssignedAgent() != null ? ticket.getAssignedAgent().getId() : null,
                ticket.getAssignedAgent() != null ? ticket.getAssignedAgent().getFullName() : null,
                ticket.getRelatedIncident() != null ? ticket.getRelatedIncident().getId() : null,
                ticket.getRelatedIncident() != null ? ticket.getRelatedIncident().getTitle() : null,
                ticket.getEscalatedAt() != null,
                ticket.getEscalatedToTeam(),
                ticket.getResolutionSummary(),
                ticket.getDueAt(),
                ticket.getWaitingSince(),
                ticket.getResolvedAt(),
                ticket.getReopenedAt(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                TicketSlaResolver.resolve(slaRecord).name()
        );
    }

    public TicketCommentResponse toCommentResponse(TicketComment comment) {
        return new TicketCommentResponse(
                comment.getId(),
                comment.getAuthor().getId(),
                comment.getAuthor().getFullName(),
                comment.getContent(),
                comment.isInternalNote(),
                comment.getCreatedAt()
        );
    }

    public TicketDetailResponse toDetail(
            Ticket ticket,
            SlaRecord slaRecord,
            List<TicketCommentResponse> comments,
            List<ActivityLogResponse> activity
    ) {
        return new TicketDetailResponse(
                ticket.getId(),
                ticket.getSubject(),
                ticket.getDescription(),
                ticket.getStatus().name(),
                ticket.getPriority().name(),
                ticket.getCustomer().getId(),
                ticket.getCustomer().getName(),
                ticket.getCustomer().getCompany(),
                ticket.getAssignedAgent() != null ? ticket.getAssignedAgent().getId() : null,
                ticket.getAssignedAgent() != null ? ticket.getAssignedAgent().getFullName() : null,
                ticket.getRelatedIncident() != null ? ticket.getRelatedIncident().getId() : null,
                ticket.getRelatedIncident() != null ? ticket.getRelatedIncident().getTitle() : null,
                ticket.getEscalatedAt() != null,
                ticket.getEscalatedToTeam(),
                ticket.getEscalationReason(),
                ticket.getEscalatedAt(),
                ticket.getDueAt(),
                ticket.getWaitingSince(),
                ticket.getResolvedAt(),
                ticket.getResolutionSummary(),
                ticket.getCloseNotes(),
                ticket.getReopenedAt(),
                ticket.getReopenReason(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                TicketSlaResolver.resolve(slaRecord).name(),
                comments,
                activity
        );
    }
}
