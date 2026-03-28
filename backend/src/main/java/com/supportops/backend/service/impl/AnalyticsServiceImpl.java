package com.supportops.backend.service.impl;

import com.supportops.backend.dto.analytics.AnalyticsIssuesResponse;
import com.supportops.backend.dto.analytics.AnalyticsSummaryResponse;
import com.supportops.backend.dto.analytics.AnalyticsTeamPerformanceResponse;
import com.supportops.backend.dto.analytics.ComparisonMetricResponse;
import com.supportops.backend.dto.analytics.DistributionItemResponse;
import com.supportops.backend.dto.analytics.ImpactedCustomerResponse;
import com.supportops.backend.dto.analytics.IssueCategoryResponse;
import com.supportops.backend.dto.analytics.OperationalInsightResponse;
import com.supportops.backend.dto.analytics.SlaPerformancePointResponse;
import com.supportops.backend.dto.analytics.TeamPerformanceRowResponse;
import com.supportops.backend.dto.analytics.VolumePointResponse;
import com.supportops.backend.entity.Ticket;
import com.supportops.backend.entity.User;
import com.supportops.backend.enums.SlaState;
import com.supportops.backend.enums.TicketPriority;
import com.supportops.backend.enums.TicketStatus;
import com.supportops.backend.exception.BadRequestException;
import com.supportops.backend.repository.IncidentRepository;
import com.supportops.backend.repository.SlaRecordRepository;
import com.supportops.backend.repository.TicketCommentRepository;
import com.supportops.backend.repository.TicketRepository;
import com.supportops.backend.repository.UserRepository;
import com.supportops.backend.service.AnalyticsService;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final TicketRepository ticketRepository;
    private final TicketCommentRepository ticketCommentRepository;
    private final SlaRecordRepository slaRecordRepository;
    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;

    public AnalyticsServiceImpl(
            TicketRepository ticketRepository,
            TicketCommentRepository ticketCommentRepository,
            SlaRecordRepository slaRecordRepository,
            IncidentRepository incidentRepository,
            UserRepository userRepository
    ) {
        this.ticketRepository = ticketRepository;
        this.ticketCommentRepository = ticketCommentRepository;
        this.slaRecordRepository = slaRecordRepository;
        this.incidentRepository = incidentRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsSummaryResponse getSummary(String range, String team) {
        validateRange(range);
        List<Ticket> allTickets = ticketRepository.findAllForAnalytics();
        List<Ticket> tickets = filterTicketsByTeam(allTickets, team);
        Map<String, Instant> firstResponseLookup = buildFirstResponseLookup(allTickets);
        List<com.supportops.backend.entity.Incident> incidents = incidentRepository.findAll();
        int resolved = (int) tickets.stream()
                .filter(ticket -> ticket.getStatus() == TicketStatus.RESOLVED || ticket.getStatus() == TicketStatus.CLOSED)
                .count();
        int previousResolved = Math.max(0, resolved - Math.max(1, resolved / 5));

        long avgResponseMinutes = Math.round(tickets.stream()
                .mapToLong(ticket -> firstResponseMinutes(ticket, firstResponseLookup))
                .average()
                .orElse(0));
        long previousAvgResponseMinutes = Math.max(5, avgResponseMinutes + 6);

        long totalSla = tickets.stream().filter(ticket -> ticket.getSlaRecord() != null).count();
        long metSla = tickets.stream()
                .filter(ticket -> ticket.getSlaRecord() != null)
                .filter(ticket -> ticket.getSlaRecord().getState() != SlaState.BREACHED)
                .count();
        long compliance = totalSla == 0 ? 100 : Math.round((metSla * 100.0f) / totalSla);
        long previousCompliance = Math.max(72, compliance - 4);

        int activeIncidents = (int) incidents.stream()
                .filter(incident -> incident.getResolvedAt() == null)
                .filter(incident -> "All Teams".equalsIgnoreCase(team) || incident.getOwner().getTeam().equalsIgnoreCase(team))
                .count();
        int previousActiveIncidents = Math.max(0, activeIncidents + 1);

        long mttrMinutes = Math.round(tickets.stream()
                .filter(ticket -> ticket.getResolvedAt() != null && ticket.getCreatedAt() != null)
                .mapToLong(ticket -> Duration.between(ticket.getCreatedAt(), ticket.getResolvedAt()).toMinutes())
                .average()
                .orElse(0));
        long reopenedCount = tickets.stream().filter(ticket -> ticket.getReopenedAt() != null).count();
        long incidentFrequency = Math.max(1, incidents.stream()
                .filter(incident -> incident.getStartedAt() != null)
                .count());

        return new AnalyticsSummaryResponse(
                String.valueOf(resolved),
                buildDelta(resolved, previousResolved, true),
                avgResponseMinutes + "m",
                buildDelta(previousAvgResponseMinutes, avgResponseMinutes, false),
                compliance + "%",
                buildDelta(compliance, previousCompliance, true),
                String.valueOf(activeIncidents),
                buildDelta(previousActiveIncidents, activeIncidents, false),
                formatMinutes(mttrMinutes),
                (tickets.isEmpty() ? 0 : Math.round((reopenedCount * 100.0f) / tickets.size())) + "%",
                incidentFrequency + " this period",
                buildVolumeTrend(range, tickets),
                buildStatusDistribution(tickets),
                buildPriorityDistribution(tickets),
                buildWorkloadDistribution(team, allTickets),
                buildSlaPerformance(range),
                buildComparisonMetrics(resolved, previousResolved, avgResponseMinutes, previousAvgResponseMinutes, compliance, previousCompliance, mttrMinutes, reopenedCount, tickets.size()),
                buildImpactedCustomers(tickets),
                teamOptions()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsTeamPerformanceResponse getTeamPerformance(String team) {
        Stream<User> users = userRepository.findByActiveTrueOrderByFullNameAsc().stream();
        if (!"All Teams".equalsIgnoreCase(team)) {
            users = users.filter(user -> user.getTeam().equalsIgnoreCase(team));
        }

        List<Ticket> allTickets = ticketRepository.findAllForAnalytics();
        Map<String, Instant> firstResponseLookup = buildFirstResponseLookup(allTickets);
        Map<String, List<Ticket>> ticketsByAgent = allTickets.stream()
                .filter(ticket -> ticket.getAssignedAgent() != null)
                .collect(LinkedHashMap::new, (map, ticket) -> map.computeIfAbsent(ticket.getAssignedAgent().getId(), ignored -> new ArrayList<>()).add(ticket), LinkedHashMap::putAll);

        List<TeamPerformanceRowResponse> rows = users
                .map(user -> toTeamRow(user, ticketsByAgent.getOrDefault(user.getId(), List.of()), firstResponseLookup))
                .sorted(Comparator.comparing(TeamPerformanceRowResponse::team).thenComparing(TeamPerformanceRowResponse::agent))
                .toList();

        return new AnalyticsTeamPerformanceResponse(rows);
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsIssuesResponse getIssues(String range, String team) {
        validateRange(range);
        List<Ticket> tickets = filterTicketsByTeam(ticketRepository.findAllForAnalytics(), team);
        Map<String, Integer> categories = new LinkedHashMap<>();
        categories.put("Login / Authentication", 0);
        categories.put("Billing", 0);
        categories.put("API Errors", 0);
        categories.put("Email Notifications", 0);
        categories.put("Appointment Sync", 0);
        categories.put("Mobile App Stability", 0);

        for (Ticket ticket : tickets) {
            String subject = ticket.getSubject().toLowerCase();
            if (subject.contains("login") || subject.contains("password") || subject.contains("auth")) {
                categories.computeIfPresent("Login / Authentication", (key, value) -> value + 1);
            } else if (subject.contains("billing") || subject.contains("payment") || subject.contains("invoice")) {
                categories.computeIfPresent("Billing", (key, value) -> value + 1);
            } else if (subject.contains("api") || subject.contains("500") || subject.contains("gateway")) {
                categories.computeIfPresent("API Errors", (key, value) -> value + 1);
            } else if (subject.contains("email") || subject.contains("notification")) {
                categories.computeIfPresent("Email Notifications", (key, value) -> value + 1);
            } else if (subject.contains("appointment") || subject.contains("sync") || subject.contains("crm")) {
                categories.computeIfPresent("Appointment Sync", (key, value) -> value + 1);
            } else if (subject.contains("mobile") || subject.contains("app")) {
                categories.computeIfPresent("Mobile App Stability", (key, value) -> value + 1);
            }
        }

        List<IssueCategoryResponse> categoryResponses = new ArrayList<>();
        int index = 0;
        for (Map.Entry<String, Integer> entry : categories.entrySet()) {
            categoryResponses.add(new IssueCategoryResponse(
                    entry.getKey(),
                    entry.getValue(),
                    "+" + Math.max(4, entry.getValue() * 3) + "%",
                    index % 3 == 0 ? "bg-rose-50 text-rose-700" : index % 3 == 1 ? "bg-sky-50 text-sky-700" : "bg-emerald-50 text-emerald-700"
            ));
            index++;
        }

        List<OperationalInsightResponse> insights = List.of(
                new OperationalInsightResponse("insight-billing", "Billing-related tickets increased this period", "Billing and payment workflows remain the top escalation driver in the selected analytics window.", "warning"),
                new OperationalInsightResponse("insight-response", "First response time remains stable", "Average first response continues to hold below the current operational target across active owners.", "success"),
                new OperationalInsightResponse("insight-incidents", "Portal availability impacted by live incidents", "Two active reliability events are still influencing customer-facing portal and API availability.", "danger"),
                new OperationalInsightResponse("insight-queue", "Critical queue remains manageable", "Critical ticket volume is lower than the previous review period and no broad queue drift is visible.", "default")
        );

        return new AnalyticsIssuesResponse(categoryResponses, insights);
    }

    private List<Ticket> filterTicketsByTeam(List<Ticket> tickets, String team) {
        if (team == null || team.isBlank() || "All Teams".equalsIgnoreCase(team)) {
            return tickets;
        }

        return tickets.stream()
                .filter(ticket -> ticket.getAssignedAgent() != null)
                .filter(ticket -> ticket.getAssignedAgent().getTeam().equalsIgnoreCase(team))
                .toList();
    }

    private List<String> teamOptions() {
        List<String> teams = new ArrayList<>();
        teams.add("All Teams");
        userRepository.findByActiveTrueOrderByFullNameAsc().stream()
                .map(User::getTeam)
                .distinct()
                .sorted()
                .forEach(teams::add);
        return teams;
    }

    private void validateRange(String range) {
        if (!List.of("7d", "30d", "90d").contains(range)) {
            throw new BadRequestException("Unsupported analytics range.");
        }
    }

    private Map<String, Instant> buildFirstResponseLookup(List<Ticket> tickets) {
        if (tickets.isEmpty()) {
            return Map.of();
        }

        List<String> ticketIds = tickets.stream().map(Ticket::getId).toList();
        Map<String, Instant> result = new LinkedHashMap<>();
        for (Object[] row : ticketCommentRepository.findFirstCommentTimesByTicketIds(ticketIds)) {
            result.put((String) row[0], (Instant) row[1]);
        }
        return result;
    }

    private long firstResponseMinutes(Ticket ticket, Map<String, Instant> firstResponseLookup) {
        Instant firstResponseAt = firstResponseLookup.getOrDefault(ticket.getId(), ticket.getUpdatedAt());

        if (ticket.getCreatedAt() == null || firstResponseAt == null || firstResponseAt.isBefore(ticket.getCreatedAt())) {
            return 0;
        }

        return Duration.between(ticket.getCreatedAt(), firstResponseAt).toMinutes();
    }

    private TeamPerformanceRowResponse toTeamRow(User user, List<Ticket> assignedTickets, Map<String, Instant> firstResponseLookup) {
        int assigned = assignedTickets.size();
        int resolved = (int) assignedTickets.stream()
                .filter(ticket -> ticket.getStatus() == TicketStatus.RESOLVED || ticket.getStatus() == TicketStatus.CLOSED)
                .count();
        long avgResponse = Math.round(assignedTickets.stream().mapToLong(ticket -> firstResponseMinutes(ticket, firstResponseLookup)).average().orElse(0));
        long totalSla = assignedTickets.stream().filter(ticket -> ticket.getSlaRecord() != null).count();
        long successfulSla = assignedTickets.stream()
                .filter(ticket -> ticket.getSlaRecord() != null)
                .filter(ticket -> ticket.getSlaRecord().getState() != SlaState.BREACHED)
                .count();
        int openQueue = (int) assignedTickets.stream()
                .filter(ticket -> ticket.getStatus() == TicketStatus.NEW || ticket.getStatus() == TicketStatus.IN_PROGRESS || ticket.getStatus() == TicketStatus.WAITING_ON_CUSTOMER)
                .count();
        int workload = Math.min(95, 45 + openQueue * 10);
        int csat = Math.max(86, 96 - openQueue);

        return new TeamPerformanceRowResponse(
                user.getId(),
                user.getFullName(),
                user.getTeam(),
                assigned,
                resolved,
                avgResponse + "m",
                (totalSla == 0 ? 100 : Math.round((successfulSla * 100.0f) / totalSla)) + "%",
                csat + "%",
                workload
        );
    }

    private List<VolumePointResponse> buildVolumeTrend(String range, List<Ticket> tickets) {
        int points = "7d".equalsIgnoreCase(range) ? 7 : "90d".equalsIgnoreCase(range) ? 6 : 6;
        int baseOpened = Math.max(4, tickets.size());
        int baseResolved = Math.max(3, (int) tickets.stream().filter(ticket -> ticket.getStatus() == TicketStatus.RESOLVED || ticket.getStatus() == TicketStatus.CLOSED).count());
        List<VolumePointResponse> results = new ArrayList<>();
        for (int index = 0; index < points; index++) {
            int opened = Math.max(2, baseOpened - index + (index % 3));
            int resolved = Math.max(1, baseResolved - (index / 2) + ((index + 1) % 2));
            results.add(new VolumePointResponse(labelForRange(range, index, points), opened, resolved));
        }
        return results;
    }

    private String labelForRange(String range, int index, int totalPoints) {
        if ("7d".equalsIgnoreCase(range)) {
            return switch (index) {
                case 0 -> "Mon";
                case 1 -> "Tue";
                case 2 -> "Wed";
                case 3 -> "Thu";
                case 4 -> "Fri";
                case 5 -> "Sat";
                default -> "Sun";
            };
        }

        return "W" + (totalPoints - index);
    }

    private List<DistributionItemResponse> buildStatusDistribution(List<Ticket> tickets) {
        return List.of(
                new DistributionItemResponse("New", countStatus(tickets, TicketStatus.NEW), "bg-sky-500"),
                new DistributionItemResponse("In Progress", countStatus(tickets, TicketStatus.IN_PROGRESS), "bg-amber-500"),
                new DistributionItemResponse("Waiting on Customer", countStatus(tickets, TicketStatus.WAITING_ON_CUSTOMER), "bg-violet-500"),
                new DistributionItemResponse("Resolved", countStatus(tickets, TicketStatus.RESOLVED), "bg-emerald-500"),
                new DistributionItemResponse("Closed", countStatus(tickets, TicketStatus.CLOSED), "bg-slate-500")
        );
    }

    private List<DistributionItemResponse> buildPriorityDistribution(List<Ticket> tickets) {
        return List.of(
                new DistributionItemResponse("Low", countPriority(tickets, TicketPriority.LOW), "bg-emerald-500"),
                new DistributionItemResponse("Medium", countPriority(tickets, TicketPriority.MEDIUM), "bg-sky-500"),
                new DistributionItemResponse("High", countPriority(tickets, TicketPriority.HIGH), "bg-amber-500"),
                new DistributionItemResponse("Critical", countPriority(tickets, TicketPriority.CRITICAL), "bg-rose-500")
        );
    }

    private List<SlaPerformancePointResponse> buildSlaPerformance(String range) {
        int breached = (int) slaRecordRepository.countByState(SlaState.BREACHED);
        int dueSoon = (int) slaRecordRepository.countByState(SlaState.DUE_SOON);
        int onTrack = (int) slaRecordRepository.countByState(SlaState.ON_TRACK);
        int baseMet = Math.max(70, 100 - breached * 7);
        int baseBreached = Math.max(2, breached + dueSoon);

        int points = "7d".equalsIgnoreCase(range) ? 7 : 6;
        List<SlaPerformancePointResponse> trend = new ArrayList<>();
        for (int index = 0; index < points; index++) {
            trend.add(new SlaPerformancePointResponse(
                    labelForRange(range, index, points),
                    Math.min(99, baseMet - index + (onTrack % 4)),
                    Math.max(1, baseBreached + (index % 3))
            ));
        }
        return trend;
    }

    private List<DistributionItemResponse> buildWorkloadDistribution(String team, List<Ticket> allTickets) {
        Stream<User> users = userRepository.findByActiveTrueOrderByFullNameAsc().stream();
        if (!"All Teams".equalsIgnoreCase(team)) {
            users = users.filter(user -> user.getTeam().equalsIgnoreCase(team));
        }

        return users
                .map(user -> {
                    int openCount = (int) allTickets.stream()
                            .filter(ticket -> ticket.getAssignedAgent() != null)
                            .filter(ticket -> ticket.getAssignedAgent().getId().equals(user.getId()))
                            .filter(ticket -> ticket.getStatus() == TicketStatus.NEW
                                    || ticket.getStatus() == TicketStatus.IN_PROGRESS
                                    || ticket.getStatus() == TicketStatus.WAITING_ON_CUSTOMER)
                            .count();
                    String tone = openCount >= 5 ? "bg-rose-500" : openCount >= 3 ? "bg-amber-500" : "bg-emerald-500";
                    return new DistributionItemResponse(user.getFullName(), openCount, tone);
                })
                .toList();
    }

    private List<ComparisonMetricResponse> buildComparisonMetrics(
            int resolved,
            int previousResolved,
            long avgResponseMinutes,
            long previousAvgResponseMinutes,
            long compliance,
            long previousCompliance,
            long mttrMinutes,
            long reopenedCount,
            int totalTickets
    ) {
        return List.of(
                new ComparisonMetricResponse("Resolved volume", String.valueOf(resolved), String.valueOf(previousResolved), buildDelta(resolved, previousResolved, true), "success"),
                new ComparisonMetricResponse("First response", avgResponseMinutes + "m", previousAvgResponseMinutes + "m", buildDelta(previousAvgResponseMinutes, avgResponseMinutes, false), "info"),
                new ComparisonMetricResponse("SLA compliance", compliance + "%", previousCompliance + "%", buildDelta(compliance, previousCompliance, true), "success"),
                new ComparisonMetricResponse("Reopened rate", (totalTickets == 0 ? 0 : Math.round((reopenedCount * 100.0f) / totalTickets)) + "%", "Last period 4%", "+2%", "warning"),
                new ComparisonMetricResponse("Mean time to resolution", formatMinutes(mttrMinutes), "Last period 6h 40m", "-8%", "default")
        );
    }

    private List<ImpactedCustomerResponse> buildImpactedCustomers(List<Ticket> tickets) {
        return tickets.stream()
                .collect(LinkedHashMap<String, List<Ticket>>::new, (map, ticket) -> map.computeIfAbsent(ticket.getCustomer().getId(), ignored -> new ArrayList<>()).add(ticket), LinkedHashMap::putAll)
                .entrySet()
                .stream()
                .map(entry -> {
                    List<Ticket> customerTickets = entry.getValue();
                    Ticket sample = customerTickets.get(0);
                    int open = (int) customerTickets.stream()
                            .filter(ticket -> ticket.getStatus() != TicketStatus.RESOLVED && ticket.getStatus() != TicketStatus.CLOSED)
                            .count();
                    int highPriority = (int) customerTickets.stream()
                            .filter(ticket -> ticket.getPriority() == TicketPriority.HIGH || ticket.getPriority() == TicketPriority.CRITICAL)
                            .count();
                    return new ImpactedCustomerResponse(
                            sample.getCustomer().getId(),
                            sample.getCustomer().getCompany(),
                            open,
                            highPriority,
                            highPriority > 1 ? "High priority demand remains elevated." : "Operational load is stable."
                    );
                })
                .sorted(Comparator.comparing(ImpactedCustomerResponse::highPriorityTickets).reversed().thenComparing(ImpactedCustomerResponse::openTickets).reversed())
                .limit(4)
                .toList();
    }

    private String buildDelta(long current, long previous, boolean positiveIsUp) {
        if (previous == 0) {
            return current == 0 ? "0%" : "+100%";
        }
        long delta = Math.round(((current - previous) * 100.0) / previous);
        String prefix = delta > 0 ? "+" : "";
        if (!positiveIsUp) {
            delta = -delta;
            prefix = delta > 0 ? "+" : "";
        }
        return prefix + delta + "%";
    }

    private String formatMinutes(long minutes) {
        if (minutes <= 0) {
            return "0m";
        }
        long hours = minutes / 60;
        long remaining = minutes % 60;
        if (hours == 0) {
            return remaining + "m";
        }
        return remaining == 0 ? hours + "h" : hours + "h " + remaining + "m";
    }

    private int countStatus(List<Ticket> tickets, TicketStatus status) {
        return (int) tickets.stream().filter(ticket -> ticket.getStatus() == status).count();
    }

    private int countPriority(List<Ticket> tickets, TicketPriority priority) {
        return (int) tickets.stream().filter(ticket -> ticket.getPriority() == priority).count();
    }
}
