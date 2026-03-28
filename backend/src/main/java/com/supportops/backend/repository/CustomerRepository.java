package com.supportops.backend.repository;

import com.supportops.backend.entity.Customer;
import com.supportops.backend.enums.CustomerHealth;
import com.supportops.backend.enums.CustomerSegment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerRepository extends JpaRepository<Customer, String> {

    List<Customer> findBySegmentOrderByUpdatedAtDesc(CustomerSegment segment);

    List<Customer> findByHealthOrderByUpdatedAtDesc(CustomerHealth health);

    List<Customer> findByNameContainingIgnoreCaseOrCompanyContainingIgnoreCaseOrderByUpdatedAtDesc(String name, String company);

    @EntityGraph(attributePaths = {"owner"})
    @Query("""
            select customer
            from Customer customer
            left join customer.owner owner
            where (:q = '' or lower(customer.name) like concat('%', :q, '%')
                or lower(customer.company) like concat('%', :q, '%')
                or lower(customer.email) like concat('%', :q, '%'))
              and (:segment is null or customer.segment = :segment)
              and (:health is null or customer.health = :health)
            order by customer.updatedAt desc
            """)
    List<Customer> searchCustomers(
            @Param("q") String q,
            @Param("segment") CustomerSegment segment,
            @Param("health") CustomerHealth health
    );

    @EntityGraph(attributePaths = {"owner"})
    @Query("select customer from Customer customer left join customer.owner owner where customer.id = :id")
    Optional<Customer> findWithOwnerById(@Param("id") String id);
}
