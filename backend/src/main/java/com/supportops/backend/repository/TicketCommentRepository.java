package com.supportops.backend.repository;

import com.supportops.backend.entity.TicketComment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketCommentRepository extends JpaRepository<TicketComment, String> {

    List<TicketComment> findByTicketIdOrderByCreatedAtAsc(String ticketId);

    long countByTicketId(String ticketId);

    Optional<TicketComment> findFirstByTicketIdOrderByCreatedAtAsc(String ticketId);
}
