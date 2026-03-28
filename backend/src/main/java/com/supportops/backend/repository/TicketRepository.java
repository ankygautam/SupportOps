package com.supportops.backend.repository;

import com.supportops.backend.entity.Ticket;
import com.supportops.backend.entity.User;
import com.supportops.backend.enums.TicketStatus;
import java.util.List;
import java.util.Collection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, String> {

    List<Ticket> findByStatusOrderByUpdatedAtDesc(TicketStatus status);

    List<Ticket> findByAssignedAgentOrderByUpdatedAtDesc(User assignedAgent);

    List<Ticket> findByAssignedAgentId(String assignedAgentId);

    List<Ticket> findByCustomerIdOrderByUpdatedAtDesc(String customerId);

    List<Ticket> findByRelatedIncidentIdOrderByUpdatedAtDesc(String relatedIncidentId);

    long countByStatus(TicketStatus status);

    long countByAssignedAgentId(String assignedAgentId);

    long countByAssignedAgentIdAndStatusIn(String assignedAgentId, Collection<TicketStatus> statuses);

    List<Ticket> findAllByOrderByUpdatedAtDesc();
}
