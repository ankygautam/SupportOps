package com.supportops.backend.service.impl;

import com.supportops.backend.dto.customer.CustomerQuery;
import com.supportops.backend.dto.customer.CustomerDetailResponse;
import com.supportops.backend.dto.customer.CustomerSummaryResponse;
import com.supportops.backend.entity.Customer;
import com.supportops.backend.enums.CustomerHealth;
import com.supportops.backend.enums.CustomerSegment;
import com.supportops.backend.enums.TicketStatus;
import com.supportops.backend.exception.BadRequestException;
import com.supportops.backend.exception.ResourceNotFoundException;
import com.supportops.backend.mapper.CustomerMapper;
import com.supportops.backend.repository.CustomerRepository;
import com.supportops.backend.repository.TicketRepository;
import com.supportops.backend.service.CustomerService;
import com.supportops.backend.utils.QueryUtils;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final TicketRepository ticketRepository;
    private final CustomerMapper customerMapper;

    public CustomerServiceImpl(
            CustomerRepository customerRepository,
            TicketRepository ticketRepository,
            CustomerMapper customerMapper
    ) {
        this.customerRepository = customerRepository;
        this.ticketRepository = ticketRepository;
        this.customerMapper = customerMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerSummaryResponse> getCustomers(CustomerQuery query) {
        String normalizedQuery = QueryUtils.normalizeSearch(query.q());
        CustomerSegment segment = parseSegment(query.segment());
        CustomerHealth health = parseHealth(query.health());
        List<Customer> customers;
        if (segment == null && health == null && normalizedQuery.isBlank()) {
            customers = customerRepository.findAll();
        } else if (segment == null && health == null) {
            customers = customerRepository.findByNameContainingIgnoreCaseOrCompanyContainingIgnoreCaseOrderByUpdatedAtDesc(normalizedQuery, normalizedQuery);
        } else {
            customers = customerRepository.searchCustomers(normalizedQuery, segment, health);
        }
        Map<String, Long> openTicketCounts = countOpenTicketsByCustomerIds(customers.stream().map(Customer::getId).toList());

        return customers.stream()
                .map(customer -> customerMapper.toSummary(customer, openTicketCounts.getOrDefault(customer.getId(), 0L)))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerDetailResponse getCustomer(String id) {
        Customer customer = customerRepository.findWithOwnerById(id)
                .or(() -> customerRepository.findById(id))
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found."));

        List<String> recentTickets = ticketRepository.findByCustomerIdOrderByUpdatedAtDesc(customer.getId(), PageRequest.of(0, 5)).stream()
                .map(ticket -> ticket.getId())
                .toList();
        if (recentTickets.isEmpty()) {
            recentTickets = ticketRepository.findByCustomerIdOrderByUpdatedAtDesc(customer.getId()).stream()
                    .limit(5)
                    .map(ticket -> ticket.getId())
                    .toList();
        }

        return customerMapper.toDetail(customer, countOpenTicketsByCustomerIds(List.of(customer.getId())).getOrDefault(customer.getId(), 0L), recentTickets);
    }

    private Map<String, Long> countOpenTicketsByCustomerIds(List<String> customerIds) {
        if (customerIds.isEmpty()) {
            return Map.of();
        }

        Map<String, Long> counts = ticketRepository.countOpenTicketsByCustomerIds(customerIds, List.of(TicketStatus.RESOLVED, TicketStatus.CLOSED)).stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> (Long) row[1]
                ));

        if (!counts.isEmpty()) {
            return counts;
        }

        return customerIds.stream()
                .collect(Collectors.toMap(
                        customerId -> customerId,
                        customerId -> ticketRepository.findByCustomerIdOrderByUpdatedAtDesc(customerId).stream()
                                .filter(ticket -> ticket.getStatus() != TicketStatus.RESOLVED && ticket.getStatus() != TicketStatus.CLOSED)
                                .count()
                ));
    }

    private CustomerSegment parseSegment(String segment) {
        if (QueryUtils.isBlank(segment)) {
            return null;
        }

        try {
            return CustomerSegment.valueOf(segment.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new BadRequestException("Invalid customer segment filter.");
        }
    }

    private CustomerHealth parseHealth(String health) {
        if (QueryUtils.isBlank(health)) {
            return null;
        }

        try {
            return CustomerHealth.valueOf(health.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new BadRequestException("Invalid customer health filter.");
        }
    }
}
