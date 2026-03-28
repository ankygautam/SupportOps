package com.supportops.backend.service.impl;

import com.supportops.backend.dto.common.ActivityLogResponse;
import com.supportops.backend.dto.dashboard.DashboardSummaryResponse;
import com.supportops.backend.enums.IncidentSeverity;
import com.supportops.backend.enums.SlaState;
import com.supportops.backend.enums.TicketStatus;
import com.supportops.backend.entity.Ticket;
import com.supportops.backend.mapper.ActivityLogMapper;
import com.supportops.backend.repository.ActivityLogRepository;
import com.supportops.backend.repository.IncidentRepository;
import com.supportops.backend.repository.SlaRecordRepository;
import com.supportops.backend.repository.TicketCommentRepository;
import com.supportops.backend.repository.TicketRepository;
import com.supportops.backend.repository.UserRepository;
import com.supportops.backend.service.DashboardService;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final TicketRepository ticketRepository;
    private final IncidentRepository incidentRepository;
    private final SlaRecordRepository slaRecordRepository;
    private final TicketCommentRepository ticketCommentRepository;
    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;
    private final ActivityLogMapper activityLogMapper;

    public DashboardServiceImpl(
            TicketRepository ticketRepository,
            IncidentRepository incidentRepository,
            SlaRecordRepository slaRecordRepository,
            TicketCommentRepository ticketCommentRepository,
            UserRepository userRepository,
            ActivityLogRepository activityLogRepository,
            ActivityLogMapper activityLogMapper
    ) {
        this.ticketRepository = ticketRepository;
        this.incidentRepository = incidentRepository;
        this.slaRecordRepository = slaRecordRepository;
        this.ticketCommentRepository = ticketCommentRepository;
        this.userRepository = userRepository;
        this.activityLogRepository = activityLogRepository;
        this.activityLogMapper = activityLogMapper;
    }

    @Override
    public DashboardSummaryResponse getSummary() {
        long openTickets = ticketRepository.countByStatus(TicketStatus.NEW)
                + ticketRepository.countByStatus(TicketStatus.IN_PROGRESS)
                + ticketRepository.countByStatus(TicketStatus.WAITING_ON_CUSTOMER);

        long criticalIncidents = incidentRepository.countBySeverity(IncidentSeverity.CRITICAL);

        long breaches = slaRecordRepository.countByState(SlaState.BREACHED);

        long averageFirstResponseMinutes = Math.round(ticketRepository.findAll().stream()
                .mapToLong(this::firstResponseMinutes)
                .average()
                .orElse(0));

        long assignedToMeCount = currentUserId() == null
                ? 0
                : ticketRepository.findByAssignedAgentId(currentUserId()).stream()
                .filter(ticket -> ticket.getStatus() == TicketStatus.NEW
                        || ticket.getStatus() == TicketStatus.IN_PROGRESS
                        || ticket.getStatus() == TicketStatus.WAITING_ON_CUSTOMER)
                .count();

        return new DashboardSummaryResponse(openTickets, criticalIncidents, breaches, averageFirstResponseMinutes, assignedToMeCount);
    }

    @Override
    public List<ActivityLogResponse> getRecentActivity() {
        return activityLogRepository.findTop20ByOrderByCreatedAtDesc().stream()
                .map(activityLogMapper::toResponse)
                .toList();
    }

    private long firstResponseMinutes(Ticket ticket) {
        Instant firstResponseAt = ticketCommentRepository.findFirstByTicketIdOrderByCreatedAtAsc(ticket.getId())
                .map(comment -> comment.getCreatedAt())
                .orElse(ticket.getUpdatedAt());

        if (ticket.getCreatedAt() == null || firstResponseAt == null || firstResponseAt.isBefore(ticket.getCreatedAt())) {
            return 0;
        }

        return Duration.between(ticket.getCreatedAt(), firstResponseAt).toMinutes();
    }

    private String currentUserId() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            return userRepository.findByEmailIgnoreCase(email)
                    .map(user -> user.getId())
                    .orElse(null);
        } catch (Exception ignored) {
            return null;
        }
    }
}
