package com.supportops.backend.repository;

import com.supportops.backend.entity.Ticket;
import com.supportops.backend.entity.User;
import com.supportops.backend.enums.SlaState;
import com.supportops.backend.enums.TicketPriority;
import com.supportops.backend.enums.TicketStatus;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TicketRepository extends JpaRepository<Ticket, String> {

    List<Ticket> findByStatusOrderByUpdatedAtDesc(TicketStatus status);

    List<Ticket> findByAssignedAgentOrderByUpdatedAtDesc(User assignedAgent);

    @EntityGraph(attributePaths = {"customer", "assignedAgent", "slaRecord"})
    List<Ticket> findByAssignedAgentId(String assignedAgentId);

    @EntityGraph(attributePaths = {"customer", "assignedAgent", "relatedIncident", "slaRecord"})
    List<Ticket> findByCustomerIdOrderByUpdatedAtDesc(String customerId);

    @EntityGraph(attributePaths = {"customer", "assignedAgent", "relatedIncident", "slaRecord"})
    List<Ticket> findByCustomerIdOrderByUpdatedAtDesc(String customerId, Pageable pageable);

    List<Ticket> findByRelatedIncidentIdOrderByUpdatedAtDesc(String relatedIncidentId);

    long countByStatus(TicketStatus status);

    long countByAssignedAgentId(String assignedAgentId);

    long countByAssignedAgentIdAndStatusIn(String assignedAgentId, Collection<TicketStatus> statuses);

    @EntityGraph(attributePaths = {"customer", "assignedAgent", "relatedIncident", "slaRecord"})
    List<Ticket> findAllByOrderByUpdatedAtDesc();

    @EntityGraph(attributePaths = {"customer", "assignedAgent", "relatedIncident", "slaRecord"})
    @Query("""
            select t
            from Ticket t
            join t.customer customer
            left join t.assignedAgent assignedAgent
            left join t.relatedIncident relatedIncident
            left join t.slaRecord slaRecord
            where (:q = '' or lower(t.id) like concat('%', :q, '%')
                or lower(t.subject) like concat('%', :q, '%')
                or lower(customer.company) like concat('%', :q, '%')
                or lower(customer.name) like concat('%', :q, '%')
                or lower(coalesce(t.escalationReason, '')) like concat('%', :q, '%'))
              and (:status is null or t.status = :status)
              and (:priority is null or t.priority = :priority)
              and (:assignedAgentId is null or assignedAgent.id = :assignedAgentId)
              and (:customerId is null or customer.id = :customerId)
              and (:slaState is null or slaRecord.state = :slaState)
            order by t.updatedAt desc
            """)
    List<Ticket> searchTickets(
            @Param("q") String q,
            @Param("status") TicketStatus status,
            @Param("priority") TicketPriority priority,
            @Param("assignedAgentId") String assignedAgentId,
            @Param("customerId") String customerId,
            @Param("slaState") SlaState slaState
    );

    @EntityGraph(attributePaths = {"customer", "customer.owner", "assignedAgent", "relatedIncident", "slaRecord"})
    @Query("""
            select t
            from Ticket t
            left join t.customer customer
            left join t.assignedAgent assignedAgent
            left join t.relatedIncident relatedIncident
            left join t.slaRecord slaRecord
            where t.id = :id
            """)
    Optional<Ticket> findDetailedById(@Param("id") String id);

    @EntityGraph(attributePaths = {"customer", "assignedAgent", "relatedIncident", "slaRecord"})
    @Query("""
            select t
            from Ticket t
            left join t.customer customer
            left join t.assignedAgent assignedAgent
            left join t.relatedIncident relatedIncident
            left join t.slaRecord slaRecord
            """)
    List<Ticket> findAllForAnalytics();

    @Query("""
            select t.customer.id, count(t)
            from Ticket t
            where t.customer.id in :customerIds
              and t.status not in :closedStatuses
            group by t.customer.id
            """)
    List<Object[]> countOpenTicketsByCustomerIds(
            @Param("customerIds") Collection<String> customerIds,
            @Param("closedStatuses") Collection<TicketStatus> closedStatuses
    );
}
