package com.supportops.backend.repository;

import com.supportops.backend.entity.Customer;
import com.supportops.backend.enums.CustomerHealth;
import com.supportops.backend.enums.CustomerSegment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, String> {

    List<Customer> findBySegmentOrderByUpdatedAtDesc(CustomerSegment segment);

    List<Customer> findByHealthOrderByUpdatedAtDesc(CustomerHealth health);

    List<Customer> findByNameContainingIgnoreCaseOrCompanyContainingIgnoreCaseOrderByUpdatedAtDesc(String name, String company);
}
