package com.supportops.backend.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.supportops.backend.dto.ticket.TicketUpdateRequest;
import com.supportops.backend.dto.ticket.CreateTicketCommentRequest;
import com.supportops.backend.entity.Customer;
import com.supportops.backend.entity.Role;
import com.supportops.backend.entity.Ticket;
import com.supportops.backend.entity.TicketComment;
import com.supportops.backend.entity.User;
import com.supportops.backend.enums.RoleType;
import com.supportops.backend.enums.TicketPriority;
import com.supportops.backend.enums.TicketStatus;
import com.supportops.backend.exception.BadRequestException;
import com.supportops.backend.mapper.TicketMapper;
import com.supportops.backend.repository.CustomerRepository;
import com.supportops.backend.repository.IncidentRepository;
import com.supportops.backend.repository.SlaRecordRepository;
import com.supportops.backend.repository.TicketCommentRepository;
import com.supportops.backend.repository.TicketRepository;
import com.supportops.backend.repository.UserRepository;
import com.supportops.backend.service.impl.TicketServiceImpl;
import java.time.Instant;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

class TicketWorkflowServiceTest {

    private TicketRepository ticketRepository;
    private UserRepository userRepository;
    private TicketCommentRepository ticketCommentRepository;
    private ActivityLogService activityLogService;
    private TicketServiceImpl ticketService;

    @BeforeEach
    void setUp() {
        ticketRepository = mock(TicketRepository.class);
        userRepository = mock(UserRepository.class);
        ticketCommentRepository = mock(TicketCommentRepository.class);
        activityLogService = mock(ActivityLogService.class);

        ticketService = new TicketServiceImpl(
                ticketRepository,
                mock(CustomerRepository.class),
                userRepository,
                mock(IncidentRepository.class),
                mock(SlaRecordRepository.class),
                ticketCommentRepository,
                activityLogService,
                mock(NotificationService.class),
                new TicketMapper()
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void updateTicket_requiresResolvedStateBeforeCloseForNonAdmin() {
        Ticket ticket = baseTicket(TicketStatus.IN_PROGRESS);
        User lead = currentUser(RoleType.TEAM_LEAD);

        when(ticketRepository.findById("SUP-100")).thenReturn(Optional.of(ticket));
        when(userRepository.findByEmailIgnoreCase("lead@supportops.dev")).thenReturn(Optional.of(lead));

        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("lead@supportops.dev", "token"));

        TicketUpdateRequest request = new TicketUpdateRequest(
                null,
                null,
                TicketStatus.CLOSED,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );

        assertThatThrownBy(() -> ticketService.updateTicket("SUP-100", request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Tickets must be resolved before they can be closed.");

        verify(ticketRepository, never()).save(Mockito.any(Ticket.class));
    }

    @Test
    void updateTicket_requiresResolutionSummaryWhenResolving() {
        Ticket ticket = baseTicket(TicketStatus.IN_PROGRESS);
        User lead = currentUser(RoleType.TEAM_LEAD);

        when(ticketRepository.findById("SUP-100")).thenReturn(Optional.of(ticket));
        when(userRepository.findByEmailIgnoreCase("lead@supportops.dev")).thenReturn(Optional.of(lead));

        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("lead@supportops.dev", "token"));

        TicketUpdateRequest request = new TicketUpdateRequest(
                null,
                null,
                TicketStatus.RESOLVED,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );

        assertThatThrownBy(() -> ticketService.updateTicket("SUP-100", request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Resolution summary is required when resolving a ticket.");
    }

    @Test
    void updateTicket_requiresReopenReasonWhenReopeningResolvedTicket() {
        Ticket ticket = baseTicket(TicketStatus.RESOLVED);
        ticket.setResolvedAt(Instant.now().minusSeconds(3600));
        ticket.setResolutionSummary("Existing resolution.");
        User lead = currentUser(RoleType.TEAM_LEAD);

        when(ticketRepository.findById("SUP-100")).thenReturn(Optional.of(ticket));
        when(userRepository.findByEmailIgnoreCase("lead@supportops.dev")).thenReturn(Optional.of(lead));

        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("lead@supportops.dev", "token"));

        TicketUpdateRequest request = new TicketUpdateRequest(
                null,
                null,
                TicketStatus.IN_PROGRESS,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );

        assertThatThrownBy(() -> ticketService.updateTicket("SUP-100", request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Reopen reason is required when reopening a resolved ticket.");
    }

    @Test
    void addCommentPersistsCommentAndLogsActivity() {
        Ticket ticket = baseTicket(TicketStatus.IN_PROGRESS);
        User lead = currentUser(RoleType.TEAM_LEAD);

        when(ticketRepository.findById("SUP-100")).thenReturn(Optional.of(ticket));
        when(userRepository.findByEmailIgnoreCase("lead@supportops.dev")).thenReturn(Optional.of(lead));
        when(ticketCommentRepository.save(Mockito.any(TicketComment.class))).thenAnswer(invocation -> {
            TicketComment comment = invocation.getArgument(0);
            comment.setId("comment-1");
            comment.setCreatedAt(Instant.now());
            return comment;
        });

        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("lead@supportops.dev", "token"));

        var response = ticketService.addComment("SUP-100", new CreateTicketCommentRequest("Investigating with billing engineering.", false));

        assertThat(response.content()).isEqualTo("Investigating with billing engineering.");
        assertThat(response.internalNote()).isFalse();
        verify(activityLogService).log("TICKET", "SUP-100", "PUBLIC_REPLY", "Public reply added to ticket.", "Lead User");
    }

    private Ticket baseTicket(TicketStatus status) {
        Customer customer = new Customer();
        customer.setId("cust-1");
        customer.setName("Customer");
        customer.setCompany("Acme");

        User assigned = new User();
        assigned.setId("usr-1");
        assigned.setFullName("Assigned Agent");
        assigned.setEmail("agent@supportops.dev");
        assigned.setRole(role(RoleType.SUPPORT_AGENT));

        Ticket ticket = new Ticket();
        ticket.setId("SUP-100");
        ticket.setSubject("Workflow test");
        ticket.setDescription("Testing workflow rules");
        ticket.setStatus(status);
        ticket.setPriority(TicketPriority.HIGH);
        ticket.setCustomer(customer);
        ticket.setAssignedAgent(assigned);
        ticket.setDueAt(Instant.now().plusSeconds(7200));
        ticket.setCreatedAt(Instant.now().minusSeconds(7200));
        ticket.setUpdatedAt(Instant.now().minusSeconds(1800));
        return ticket;
    }

    private User currentUser(RoleType roleType) {
        User user = new User();
        user.setId("usr-current");
        user.setFullName("Lead User");
        user.setEmail("lead@supportops.dev");
        user.setRole(role(roleType));
        return user;
    }

    private Role role(RoleType type) {
        Role role = new Role();
        role.setId("role-" + type.name().toLowerCase());
        role.setName(type);
        return role;
    }
}
