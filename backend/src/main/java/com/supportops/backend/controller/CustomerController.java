package com.supportops.backend.controller;

import com.supportops.backend.dto.customer.CustomerQuery;
import com.supportops.backend.dto.customer.CustomerDetailResponse;
import com.supportops.backend.dto.customer.CustomerSummaryResponse;
import com.supportops.backend.service.CustomerService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD','SUPPORT_AGENT')")
    public ResponseEntity<List<CustomerSummaryResponse>> getCustomers(
            @RequestParam(required = false, name = "q") String q,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String segment,
            @RequestParam(required = false) String health
    ) {
        return ResponseEntity.ok(customerService.getCustomers(new CustomerQuery(q != null ? q : search, segment, health)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD','SUPPORT_AGENT')")
    public ResponseEntity<CustomerDetailResponse> getCustomer(@PathVariable String id) {
        return ResponseEntity.ok(customerService.getCustomer(id));
    }
}
