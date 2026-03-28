package com.supportops.backend.repository;

import com.supportops.backend.entity.SlaRecord;
import com.supportops.backend.enums.SlaState;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SlaRecordRepository extends JpaRepository<SlaRecord, String> {

    Optional<SlaRecord> findByTicketId(String ticketId);

    List<SlaRecord> findByBreachedTrueOrderByResolutionTargetAtAsc();

    List<SlaRecord> findByStateOrderByResolutionTargetAtAsc(SlaState state);

    long countByState(SlaState state);

    @EntityGraph(attributePaths = {"ticket", "ticket.customer", "ticket.assignedAgent"})
    @Query("""
            select slaRecord
            from SlaRecord slaRecord
            join slaRecord.ticket ticket
            join ticket.customer customer
            left join ticket.assignedAgent assignedAgent
            where (:q = '' or lower(ticket.id) like concat('%', :q, '%')
                or lower(ticket.subject) like concat('%', :q, '%')
                or lower(customer.company) like concat('%', :q, '%'))
              and (:team is null or (assignedAgent is not null and lower(assignedAgent.team) = lower(:team)))
              and (:state is null or slaRecord.state = :state)
            order by slaRecord.resolutionTargetAt asc
            """)
    List<SlaRecord> searchRecords(
            @Param("q") String q,
            @Param("team") String team,
            @Param("state") SlaState state
    );

    @EntityGraph(attributePaths = {"ticket", "ticket.customer", "ticket.assignedAgent"})
    @Query("""
            select slaRecord
            from SlaRecord slaRecord
            join slaRecord.ticket ticket
            left join ticket.customer customer
            left join ticket.assignedAgent assignedAgent
            """)
    List<SlaRecord> findAllWithTicketContext();
}
