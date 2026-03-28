package com.supportops.backend.repository;

import com.supportops.backend.entity.SlaRecord;
import com.supportops.backend.enums.SlaState;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SlaRecordRepository extends JpaRepository<SlaRecord, String> {

    Optional<SlaRecord> findByTicketId(String ticketId);

    List<SlaRecord> findByBreachedTrueOrderByResolutionTargetAtAsc();

    List<SlaRecord> findByStateOrderByResolutionTargetAtAsc(SlaState state);

    long countByState(SlaState state);
}
