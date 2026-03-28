package com.supportops.backend.service.impl;

import com.supportops.backend.dto.customer.CustomerQuery;
import com.supportops.backend.dto.customer.CustomerDetailResponse;
import com.supportops.backend.dto.customer.CustomerSummaryResponse;
import com.supportops.backend.entity.Customer;
import com.supportops.backend.enums.CustomerHealth;
import com.supportops.backend.enums.CustomerSegment;
import com.supportops.backend.exception.ResourceNotFoundException;
import com.supportops.backend.mapper.CustomerMapper;
import com.supportops.backend.repository.CustomerRepository;
import com.supportops.backend.repository.TicketRepository;
import com.supportops.backend.service.CustomerService;
import com.supportops.backend.utils.QueryUtils;
import java.util.Comparator;
import java.util.List;
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
        List<Customer> customers = normalizedQuery.isBlank()
                ? customerRepository.findAll()
                : customerRepository.findByNameContainingIgnoreCaseOrCompanyContainingIgnoreCaseOrderByUpdatedAtDesc(normalizedQuery, normalizedQuery);

        return customers.stream()
                .filter(customer -> normalizedQuery.isBlank() || customer.getEmail().toLowerCase().contains(normalizedQuery)
                        || customer.getName().toLowerCase().contains(normalizedQuery)
                        || customer.getCompany().toLowerCase().contains(normalizedQuery))
                .filter(customer -> QueryUtils.isBlank(query.segment()) || customer.getSegment().name().equalsIgnoreCase(query.segment()))
                .filter(customer -> QueryUtils.isBlank(query.health()) || customer.getHealth().name().equalsIgnoreCase(query.health()))
                .sorted(Comparator.comparing(Customer::getUpdatedAt).reversed())
                .map(customer -> customerMapper.toSummary(customer, countOpenTickets(customer.getId())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerDetailResponse getCustomer(String id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found."));

        List<String> recentTicketIds = ticketRepository.findAll().stream()
                .filter(ticket -> ticket.getCustomer().getId().equals(customer.getId()))
                .sorted(Comparator.comparing(ticket -> ticket.getUpdatedAt(), Comparator.reverseOrder()))
                .limit(5)
                .map(ticket -> ticket.getId())
                .toList();

        return customerMapper.toDetail(customer, countOpenTickets(customer.getId()), recentTicketIds);
    }

    private long countOpenTickets(String customerId) {
        return ticketRepository.findByCustomerIdOrderByUpdatedAtDesc(customerId).stream()
                .filter(ticket -> !ticket.getStatus().name().equals("RESOLVED") && !ticket.getStatus().name().equals("CLOSED"))
                .count();
    }
}
