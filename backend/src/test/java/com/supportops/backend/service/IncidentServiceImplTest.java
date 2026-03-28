package com.supportops.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.anyIterable;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.supportops.backend.dto.incident.CreateIncidentRequest;
import com.supportops.backend.dto.incident.UpdateIncidentRequest;
import com.supportops.backend.entity.Customer;
import com.supportops.backend.entity.Incident;
import com.supportops.backend.entity.Role;
import com.supportops.backend.entity.Ticket;
import com.supportops.backend.entity.User;
import com.supportops.backend.enums.IncidentSeverity;
import com.supportops.backend.enums.IncidentStatus;
import com.supportops.backend.enums.RoleType;
import com.supportops.backend.exception.BadRequestException;
import com.supportops.backend.mapper.IncidentMapper;
import com.supportops.backend.repository.IncidentRepository;
import com.supportops.backend.repository.TicketRepository;
import com.supportops.backend.repository.UserRepository;
import com.supportops.backend.service.impl.IncidentServiceImpl;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class IncidentServiceImplTest {

    private IncidentRepository incidentRepository;
    private TicketRepository ticketRepository;
    private UserRepository userRepository;
    private ActivityLogService activityLogService;
    private NotificationService notificationService;
    private IncidentServiceImpl incidentService;

    @BeforeEach
    void setUp() {
        incidentRepository = mock(IncidentRepository.class);
        ticketRepository = mock(TicketRepository.class);
        userRepository = mock(UserRepository.class);
        activityLogService = mock(ActivityLogService.class);
        notificationService = mock(NotificationService.class);

        incidentService = new IncidentServiceImpl(
                incidentRepository,
                ticketRepository,
                userRepository,
                activityLogService,
                notificationService,
                new IncidentMapper()
        );
    }

    @Test
    void createIncidentLinksTicketsAndReturnsSummary() {
        User owner = owner();
        Ticket linkedTicket = linkedTicket();

        when(userRepository.findById("usr-owner")).thenReturn(Optional.of(owner));
        when(incidentRepository.findAll()).thenReturn(List.of());
        when(incidentRepository.save(any(Incident.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(ticketRepository.findAllById(anyIterable())).thenReturn(List.of(linkedTicket));

        var response = incidentService.createIncident(new CreateIncidentRequest(
                "API gateway latency spike",
                "API Gateway",
                IncidentSeverity.HIGH,
                IncidentStatus.INVESTIGATING,
                "usr-owner",
                "Latency increased for portal traffic.",
                "Autoscaling lagged under billing traffic.",
                "Shift traffic and recycle hot nodes.",
                Instant.parse("2026-03-28T12:45:00Z"),
                List.of("SUP-4102")
        ));

        assertThat(response.id()).isEqualTo("INC-901");
        assertThat(linkedTicket.getRelatedIncident()).isNotNull();
        verify(activityLogService).log(eq("INCIDENT"), eq("INC-901"), eq("CREATED"), any(), eq(owner.getFullName()));
    }

    @Test
    void updateIncidentRejectsEmptyPayload() {
        Incident incident = new Incident();
        incident.setId("INC-910");
        when(incidentRepository.findById("INC-910")).thenReturn(Optional.of(incident));

        assertThatThrownBy(() -> incidentService.updateIncident("INC-910", new UpdateIncidentRequest(
                null, null, null, null, null, null, null, null, null, null, null
        )))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("At least one incident field must be provided for update.");
    }

    private User owner() {
        Role role = new Role();
        role.setId("role-team-lead");
        role.setName(RoleType.TEAM_LEAD);

        User user = new User();
        user.setId("usr-owner");
        user.setFullName("Nina Patel");
        user.setEmail("lead@supportops.dev");
        user.setTeam("Command Center");
        user.setRole(role);
        return user;
    }

    private Ticket linkedTicket() {
        Customer customer = new Customer();
        customer.setId("cust-1");
        customer.setCompany("Prairie Connect Services");

        Ticket ticket = new Ticket();
        ticket.setId("SUP-4102");
        ticket.setCustomer(customer);
        return ticket;
    }
}
