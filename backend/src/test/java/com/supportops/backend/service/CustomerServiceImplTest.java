package com.supportops.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.supportops.backend.dto.customer.CustomerQuery;
import com.supportops.backend.entity.Customer;
import com.supportops.backend.entity.Role;
import com.supportops.backend.entity.Ticket;
import com.supportops.backend.entity.User;
import com.supportops.backend.enums.CustomerHealth;
import com.supportops.backend.enums.CustomerSegment;
import com.supportops.backend.enums.RoleType;
import com.supportops.backend.enums.TicketPriority;
import com.supportops.backend.enums.TicketStatus;
import com.supportops.backend.mapper.CustomerMapper;
import com.supportops.backend.repository.CustomerRepository;
import com.supportops.backend.repository.TicketRepository;
import com.supportops.backend.service.impl.CustomerServiceImpl;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CustomerServiceImplTest {

    private CustomerRepository customerRepository;
    private TicketRepository ticketRepository;
    private CustomerServiceImpl customerService;

    @BeforeEach
    void setUp() {
        customerRepository = mock(CustomerRepository.class);
        ticketRepository = mock(TicketRepository.class);
        customerService = new CustomerServiceImpl(customerRepository, ticketRepository, new CustomerMapper());
    }

    @Test
    void getCustomersReturnsSearchMatchesWithOpenTicketCounts() {
        Customer customer = customer();

        when(customerRepository.findByNameContainingIgnoreCaseOrCompanyContainingIgnoreCaseOrderByUpdatedAtDesc("prairie", "prairie"))
                .thenReturn(List.of(customer));
        when(ticketRepository.findByCustomerIdOrderByUpdatedAtDesc("cust-1")).thenReturn(List.of(
                ticket(customer, "SUP-1", TicketStatus.NEW),
                ticket(customer, "SUP-2", TicketStatus.RESOLVED)
        ));

        var customers = customerService.getCustomers(new CustomerQuery("prairie", "", ""));

        assertThat(customers).hasSize(1);
        assertThat(customers.get(0).company()).isEqualTo("Prairie Connect Services");
        assertThat(customers.get(0).openTickets()).isEqualTo(1);
    }

    @Test
    void getCustomerReturnsRecentTicketIdsInDescendingOrder() {
        Customer customer = customer();

        when(customerRepository.findById("cust-1")).thenReturn(Optional.of(customer));
        when(ticketRepository.findByCustomerIdOrderByUpdatedAtDesc("cust-1")).thenReturn(List.of(
                ticket(customer, "SUP-9", TicketStatus.IN_PROGRESS),
                ticket(customer, "SUP-8", TicketStatus.NEW)
        ));
        when(ticketRepository.findAll()).thenReturn(List.of(
                ticket(customer, "SUP-9", TicketStatus.IN_PROGRESS),
                ticket(customer, "SUP-8", TicketStatus.NEW)
        ));

        var detail = customerService.getCustomer("cust-1");

        assertThat(detail.recentTicketIds()).containsExactly("SUP-9", "SUP-8");
    }

    private Customer customer() {
        Role role = new Role();
        role.setId("role-lead");
        role.setName(RoleType.TEAM_LEAD);

        User owner = new User();
        owner.setId("usr-owner");
        owner.setFullName("Nina Patel");
        owner.setRole(role);

        Customer customer = new Customer();
        customer.setId("cust-1");
        customer.setName("Marlon Hayes");
        customer.setCompany("Prairie Connect Services");
        customer.setEmail("marlon@prairieconnect.com");
        customer.setPhone("+1 403 555 0194");
        customer.setSegment(CustomerSegment.ENTERPRISE);
        customer.setHealth(CustomerHealth.WATCHLIST);
        customer.setOwner(owner);
        customer.setCreatedAt(Instant.parse("2026-01-15T10:00:00Z"));
        customer.setUpdatedAt(Instant.parse("2026-03-28T15:00:00Z"));
        return customer;
    }

    private Ticket ticket(Customer customer, String id, TicketStatus status) {
        Ticket ticket = new Ticket();
        ticket.setId(id);
        ticket.setSubject("Billing portal returns 500 error");
        ticket.setStatus(status);
        ticket.setPriority(TicketPriority.HIGH);
        ticket.setCustomer(customer);
        ticket.setUpdatedAt(Instant.parse("2026-03-28T15:00:00Z"));
        return ticket;
    }
}
