package com.supportops.backend.mapper;

import com.supportops.backend.dto.customer.CustomerDetailResponse;
import com.supportops.backend.dto.customer.CustomerSummaryResponse;
import com.supportops.backend.entity.Customer;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public CustomerSummaryResponse toSummary(Customer customer, long openTickets) {
        return new CustomerSummaryResponse(
                customer.getId(),
                customer.getName(),
                customer.getCompany(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getSegment().name(),
                customer.getHealth().name(),
                customer.getOwner().getId(),
                customer.getOwner().getFullName(),
                openTickets,
                customer.getCreatedAt(),
                customer.getUpdatedAt()
        );
    }

    public CustomerDetailResponse toDetail(Customer customer, long openTickets, List<String> recentTicketIds) {
        return new CustomerDetailResponse(
                customer.getId(),
                customer.getName(),
                customer.getCompany(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getSegment().name(),
                customer.getHealth().name(),
                customer.getOwner().getId(),
                customer.getOwner().getFullName(),
                openTickets,
                customer.getCreatedAt(),
                customer.getUpdatedAt(),
                recentTicketIds
        );
    }
}
