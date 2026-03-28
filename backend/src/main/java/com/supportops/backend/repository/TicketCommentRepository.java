package com.supportops.backend.repository;

import com.supportops.backend.entity.TicketComment;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TicketCommentRepository extends JpaRepository<TicketComment, String> {

    List<TicketComment> findByTicketIdOrderByCreatedAtAsc(String ticketId);

    long countByTicketId(String ticketId);

    Optional<TicketComment> findFirstByTicketIdOrderByCreatedAtAsc(String ticketId);

    @Query("""
            select comment.ticket.id, min(comment.createdAt)
            from TicketComment comment
            where comment.ticket.id in :ticketIds
            group by comment.ticket.id
            """)
    List<Object[]> findFirstCommentTimesByTicketIds(@Param("ticketIds") Collection<String> ticketIds);
}
