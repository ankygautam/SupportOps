package com.supportops.backend.service;

import com.supportops.backend.dto.customer.CustomerQuery;
import com.supportops.backend.dto.customer.CustomerDetailResponse;
import com.supportops.backend.dto.customer.CustomerSummaryResponse;
import java.util.List;

public interface CustomerService {

    List<CustomerSummaryResponse> getCustomers(CustomerQuery query);

    CustomerDetailResponse getCustomer(String id);
}
