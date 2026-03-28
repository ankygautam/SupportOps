package com.supportops.backend.seed;

import com.supportops.backend.entity.ActivityLog;
import com.supportops.backend.entity.Customer;
import com.supportops.backend.entity.Incident;
import com.supportops.backend.entity.Notification;
import com.supportops.backend.entity.Role;
import com.supportops.backend.entity.SlaRecord;
import com.supportops.backend.entity.Ticket;
import com.supportops.backend.entity.TicketComment;
import com.supportops.backend.entity.User;
import com.supportops.backend.entity.UserPreference;
import com.supportops.backend.enums.CustomerHealth;
import com.supportops.backend.enums.CustomerSegment;
import com.supportops.backend.enums.IncidentSeverity;
import com.supportops.backend.enums.IncidentStatus;
import com.supportops.backend.enums.NotificationType;
import com.supportops.backend.enums.RoleType;
import com.supportops.backend.enums.SlaState;
import com.supportops.backend.enums.TicketPriority;
import com.supportops.backend.enums.TicketStatus;
import com.supportops.backend.repository.ActivityLogRepository;
import com.supportops.backend.repository.CustomerRepository;
import com.supportops.backend.repository.IncidentRepository;
import com.supportops.backend.repository.NotificationRepository;
import com.supportops.backend.repository.RoleRepository;
import com.supportops.backend.repository.SlaRecordRepository;
import com.supportops.backend.repository.TicketCommentRepository;
import com.supportops.backend.repository.TicketRepository;
import com.supportops.backend.repository.UserRepository;
import com.supportops.backend.repository.UserPreferenceRepository;
import java.time.Instant;
import java.util.stream.Stream;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "app.demo", name = "enabled", havingValue = "true")
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final TicketRepository ticketRepository;
    private final TicketCommentRepository ticketCommentRepository;
    private final IncidentRepository incidentRepository;
    private final NotificationRepository notificationRepository;
    private final SlaRecordRepository slaRecordRepository;
    private final ActivityLogRepository activityLogRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            RoleRepository roleRepository,
            UserRepository userRepository,
            CustomerRepository customerRepository,
            TicketRepository ticketRepository,
            TicketCommentRepository ticketCommentRepository,
            IncidentRepository incidentRepository,
            NotificationRepository notificationRepository,
            SlaRecordRepository slaRecordRepository,
            ActivityLogRepository activityLogRepository,
            UserPreferenceRepository userPreferenceRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.ticketRepository = ticketRepository;
        this.ticketCommentRepository = ticketCommentRepository;
        this.incidentRepository = incidentRepository;
        this.notificationRepository = notificationRepository;
        this.slaRecordRepository = slaRecordRepository;
        this.activityLogRepository = activityLogRepository;
        this.userPreferenceRepository = userPreferenceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        Role adminRole = saveRole("role-admin", RoleType.ADMIN);
        Role leadRole = saveRole("role-lead", RoleType.TEAM_LEAD);
        Role agentRole = saveRole("role-agent", RoleType.SUPPORT_AGENT);

        User sarah = saveUser("usr-sarah", "Sarah Chen", "admin@supportops.dev", "Operations Leadership", adminRole);
        User maya = saveUser("usr-maya", "Maya Patel", "lead@supportops.dev", "Customer Operations", leadRole);
        User daniel = saveUser("usr-daniel", "Daniel Kim", "agent1@supportops.dev", "Network Support", agentRole);
        User noah = saveUser("usr-noah", "Noah Thompson", "noah@supportops.local", "Billing Operations", agentRole);
        User ivy = saveUser("usr-ivy", "Ivy Chen", "ivy@supportops.local", "Platform Reliability", leadRole);

        Stream.of(sarah, maya, daniel, noah, ivy).forEach(this::savePreference);

        Customer prairie = saveCustomer("cust-prairie", "Marlon Hayes", "Prairie Connect Services",
                "marlon.hayes@prairieconnect.com", "+1-780-555-0184", CustomerSegment.ENTERPRISE, CustomerHealth.WATCHLIST, maya);
        Customer maple = saveCustomer("cust-maple", "Leah Morgan", "MapleCore Retail",
                "leah.morgan@maplecore.io", "+44-20-5550-1184", CustomerSegment.ENTERPRISE, CustomerHealth.HEALTHY, daniel);
        Customer westgrid = saveCustomer("cust-westgrid", "Sonia Vale", "WestGrid Logistics",
                "sonia.vale@westgridlogistics.com", "+61-2-5550-4489", CustomerSegment.SMB, CustomerHealth.AT_RISK, noah);
        Customer urbanInk = saveCustomer("cust-urban-ink", "Jules Mercer", "Urban Ink Studio",
                "jules@urbaninkstudio.co", "+1-403-555-2201", CustomerSegment.SMB, CustomerHealth.HEALTHY, maya);
        Customer blueLine = saveCustomer("cust-blue-line", "Dr. Celia Ford", "BlueLine Wellness",
                "celia.ford@bluelinewellness.com", "+1-204-555-9018", CustomerSegment.SMB, CustomerHealth.WATCHLIST, ivy);
        Customer northPeak = saveCustomer("cust-northpeak", "Amira Keene", "NorthPeak Dental Group",
                "amira.keene@northpeakdental.ca", "+1-587-555-6120", CustomerSegment.INDIVIDUAL, CustomerHealth.HEALTHY, daniel);

        Ticket t1 = saveTicket("SUP-3021", "Intermittent internet outage in downtown district",
                "Repeated connectivity drops across downtown business circuits after overnight transport work.",
                TicketStatus.IN_PROGRESS, TicketPriority.CRITICAL, prairie, daniel, Instant.now().plusSeconds(2 * 3600));
        Ticket t2 = saveTicket("SUP-3018", "Billing portal returns 500 error on invoice exports",
                "Finance users hit a server error while exporting invoices during month-end reconciliation.",
                TicketStatus.WAITING_ON_CUSTOMER, TicketPriority.HIGH, westgrid, noah, Instant.now().plusSeconds(10 * 3600));
        Ticket t3 = saveTicket("SUP-3012", "Customer unable to reset password",
                "Reset flow loops users back to the login form after verification.",
                TicketStatus.NEW, TicketPriority.MEDIUM, maple, daniel, Instant.now().plusSeconds(24 * 3600));
        Ticket t4 = saveTicket("SUP-3009", "Appointment confirmation emails delayed",
                "Confirmation emails for studio bookings are arriving 20 minutes late.",
                TicketStatus.IN_PROGRESS, TicketPriority.MEDIUM, urbanInk, maya, Instant.now().plusSeconds(18 * 3600));
        Ticket t5 = saveTicket("SUP-3007", "Mobile app login timeout",
                "Mobile sessions are timing out during token exchange for healthcare users.",
                TicketStatus.IN_PROGRESS, TicketPriority.HIGH, blueLine, ivy, Instant.now().plusSeconds(8 * 3600));
        Ticket t6 = saveTicket("SUP-3004", "Payment sync issue with CRM",
                "CRM payment records are not updating after successful billing events.",
                TicketStatus.RESOLVED, TicketPriority.LOW, northPeak, noah, Instant.now().plusSeconds(36 * 3600));

        ticketCommentRepository.save(comment(t1, daniel, "Transport telemetry shows flap events on the downtown aggregation ring.", true));
        ticketCommentRepository.save(comment(t1, maya, "Customer updated and waiting on next transport engineering checkpoint.", false));
        ticketCommentRepository.save(comment(t2, noah, "Customer asked for exported sample payload and timestamp details.", false));

        slaRecordRepository.save(sla(t1, SlaState.BREACHED, true, 15, 240));
        slaRecordRepository.save(sla(t2, SlaState.DUE_SOON, false, 30, 480));
        slaRecordRepository.save(sla(t3, SlaState.ON_TRACK, false, 120, 960));
        slaRecordRepository.save(sla(t4, SlaState.ON_TRACK, false, 120, 960));
        slaRecordRepository.save(sla(t5, SlaState.DUE_SOON, false, 30, 480));
        slaRecordRepository.save(sla(t6, SlaState.ON_TRACK, false, 240, 1440));

        Incident i1 = saveIncident("INC-901", "API gateway latency spike", "Public API Gateway", IncidentSeverity.CRITICAL,
                IncidentStatus.MONITORING, ivy, "Gateway latency is elevated across east-region traffic.", "Connection pool exhaustion under burst load.",
                "Traffic rebalanced and pool limits temporarily increased.", Instant.now().minusSeconds(7200), null);
        Incident i2 = saveIncident("INC-899", "Billing service degraded performance", "Billing Service", IncidentSeverity.HIGH,
                IncidentStatus.IDENTIFIED, noah, "Invoice processing latency increased for finance operations.", "Slow downstream CRM sync writes.",
                "Background workers throttled while sync retries were reduced.", Instant.now().minusSeconds(5400), null);
        saveIncident("INC-894", "Email notification delays", "Notification Queue", IncidentSeverity.MEDIUM,
                IncidentStatus.RESOLVED, maya, "Delayed dispatch confirmations affected appointment workflows.", "Worker saturation in notification pipeline.",
                "Worker pool expanded and backlog drained.", Instant.now().minusSeconds(9600), Instant.now().minusSeconds(3600));

        t1.setEscalatedToTeam("Network Engineering");
        t1.setEscalationReason("Transport layer instability requires backbone coordination.");
        t1.setEscalatedAt(Instant.now().minusSeconds(3600));
        t1.setRelatedIncident(i1);
        ticketRepository.save(t1);

        t2.setWaitingSince(Instant.now().minusSeconds(9600));
        t2.setEscalatedToTeam("Billing Platform");
        t2.setEscalationReason("Server-side 500 errors need platform remediation.");
        t2.setEscalatedAt(Instant.now().minusSeconds(2400));
        t2.setRelatedIncident(i2);
        ticketRepository.save(t2);

        t6.setResolvedAt(Instant.now().minusSeconds(14400));
        t6.setResolutionSummary("Webhook mapping was corrected and historical payments were replayed.");
        t6.setCloseNotes("Customer confirmed CRM records are now accurate.");
        ticketRepository.save(t6);

        activityLogRepository.save(log("TICKET", t1.getId(), "CREATED", "Ticket created from enterprise escalation queue.", "SupportOps Intake"));
        activityLogRepository.save(log("TICKET", t1.getId(), "ASSIGNED", "Assigned to Daniel Kim for network triage.", "Maya Patel"));
        activityLogRepository.save(log("TICKET", t1.getId(), "ESCALATED", "Escalated to Network Engineering for backbone review.", "Maya Patel"));
        activityLogRepository.save(log("TICKET", t1.getId(), "INCIDENT_LINKED", "Linked to INC-901 for coordinated response.", "Ivy Chen"));
        activityLogRepository.save(log("TICKET", t1.getId(), "CUSTOMER_REPLY", "Customer shared affected branch list and requested 15-minute updates.", "Marlon Hayes"));
        activityLogRepository.save(log("TICKET", t2.getId(), "CREATED", "Billing export issue logged for finance workflow disruption.", "SupportOps Intake"));
        activityLogRepository.save(log("TICKET", t2.getId(), "WAITING_ON_CUSTOMER", "Waiting on sample exports and timestamps from customer finance team.", "Noah Thompson"));
        activityLogRepository.save(log("TICKET", t2.getId(), "INCIDENT_LINKED", "Linked to INC-899 while billing degradation is under review.", "Noah Thompson"));
        activityLogRepository.save(log("TICKET", t5.getId(), "SLA_WARNING", "Mobile auth issue is approaching breach threshold.", "Ivy Chen"));
        activityLogRepository.save(log("TICKET", t6.getId(), "RESOLVED", "Ticket resolved after payment replay validation.", "Noah Thompson"));

        activityLogRepository.save(log("INCIDENT", i1.getId(), "DETECTED", "Issue detected by monitoring on east-region API traffic.", "Monitoring"));
        activityLogRepository.save(log("INCIDENT", i1.getId(), "MITIGATION", "Temporary connection pool mitigation applied.", "Ivy Chen"));
        activityLogRepository.save(log("INCIDENT", i1.getId(), "MONITORING", "Latency returned to expected range and monitoring continues.", "Ivy Chen"));
        activityLogRepository.save(log("INCIDENT", i2.getId(), "IDENTIFIED", "Root cause isolated to CRM retry saturation.", "Noah Thompson"));
        activityLogRepository.save(log("INCIDENT", i2.getId(), "ACTION", "Worker throttling reduced customer-visible impact.", "Noah Thompson"));

        notificationRepository.save(notification(daniel, NotificationType.TICKET_ASSIGNED,
                "New ticket assigned", "SUP-3021 was assigned to you for downtown outage coordination.", "/tickets/SUP-3021"));
        notificationRepository.save(notification(maya, NotificationType.TICKET_ESCALATED,
                "Ticket escalated", "SUP-3018 was escalated into the billing platform review path.", "/tickets/SUP-3018"));
        notificationRepository.save(notification(ivy, NotificationType.INCIDENT_CREATED,
                "Incident declared", "INC-901 was declared for Public API Gateway latency.", "/incidents"));
        notificationRepository.save(notification(noah, NotificationType.SLA_BREACHED,
                "SLA breached", "SUP-3021 has breached resolution SLA and needs active follow-up.", "/sla"));
        notificationRepository.save(notification(maya, NotificationType.INCIDENT_RESOLVED,
                "Incident resolved", "INC-894 has been resolved and customer comms can move to closeout.", "/incidents"));
    }

    private Role saveRole(String id, RoleType type) {
        Role role = new Role();
        role.setId(id);
        role.setName(type);
        return roleRepository.save(role);
    }

    private User saveUser(String id, String fullName, String email, String team, Role role) {
        User user = new User();
        user.setId(id);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("supportops"));
        user.setTeam(team);
        user.setActive(true);
        user.setRole(role);
        return userRepository.save(user);
    }

    private void savePreference(User user) {
        UserPreference preference = new UserPreference();
        preference.setUser(user);
        userPreferenceRepository.save(preference);
    }

    private Customer saveCustomer(String id, String name, String company, String email, String phone,
                                  CustomerSegment segment, CustomerHealth health, User owner) {
        Customer customer = new Customer();
        customer.setId(id);
        customer.setName(name);
        customer.setCompany(company);
        customer.setEmail(email);
        customer.setPhone(phone);
        customer.setSegment(segment);
        customer.setHealth(health);
        customer.setOwner(owner);
        return customerRepository.save(customer);
    }

    private Ticket saveTicket(String id, String subject, String description, TicketStatus status, TicketPriority priority,
                              Customer customer, User assignedAgent, Instant dueAt) {
        Ticket ticket = new Ticket();
        ticket.setId(id);
        ticket.setSubject(subject);
        ticket.setDescription(description);
        ticket.setStatus(status);
        ticket.setPriority(priority);
        ticket.setCustomer(customer);
        ticket.setAssignedAgent(assignedAgent);
        ticket.setDueAt(dueAt);
        return ticketRepository.save(ticket);
    }

    private TicketComment comment(Ticket ticket, User author, String content, boolean internalNote) {
        TicketComment comment = new TicketComment();
        comment.setTicket(ticket);
        comment.setAuthor(author);
        comment.setContent(content);
        comment.setInternalNote(internalNote);
        return comment;
    }

    private SlaRecord sla(Ticket ticket, SlaState state, boolean breached, long responseMinutes, long resolutionMinutes) {
        Instant now = Instant.now();
        SlaRecord record = new SlaRecord();
        record.setTicket(ticket);
        record.setFirstResponseTargetAt(now.plusSeconds(responseMinutes * 60));
        record.setResolutionTargetAt(now.plusSeconds(resolutionMinutes * 60));
        record.setState(state);
        record.setBreached(breached);
        return record;
    }

    private Incident saveIncident(String id, String title, String affectedService, IncidentSeverity severity,
                                  IncidentStatus status, User owner, String summary, String rootCause,
                                  String mitigation, Instant startedAt, Instant resolvedAt) {
        Incident incident = new Incident();
        incident.setId(id);
        incident.setTitle(title);
        incident.setAffectedService(affectedService);
        incident.setSeverity(severity);
        incident.setStatus(status);
        incident.setOwner(owner);
        incident.setSummary(summary);
        incident.setRootCause(rootCause);
        incident.setMitigation(mitigation);
        incident.setStartedAt(startedAt);
        incident.setResolvedAt(resolvedAt);
        return incidentRepository.save(incident);
    }

    private ActivityLog log(String entityType, String entityId, String action, String description, String actorName) {
        ActivityLog activityLog = new ActivityLog();
        activityLog.setEntityType(entityType);
        activityLog.setEntityId(entityId);
        activityLog.setAction(action);
        activityLog.setDescription(description);
        activityLog.setActorName(actorName);
        return activityLog;
    }

    private Notification notification(User user, NotificationType type, String title, String message, String link) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setLink(link);
        return notification;
    }
}
