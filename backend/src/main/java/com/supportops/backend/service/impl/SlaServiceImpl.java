package com.supportops.backend.service.impl;

import com.supportops.backend.dto.sla.SlaQuery;
import com.supportops.backend.dto.sla.SlaRecordResponse;
import com.supportops.backend.dto.sla.SlaSummaryResponse;
import com.supportops.backend.enums.SlaState;
import com.supportops.backend.exception.BadRequestException;
import com.supportops.backend.mapper.SlaMapper;
import com.supportops.backend.repository.SlaRecordRepository;
import com.supportops.backend.service.SlaService;
import com.supportops.backend.utils.QueryUtils;
import java.time.Duration;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SlaServiceImpl implements SlaService {

    private final SlaRecordRepository slaRecordRepository;
    private final SlaMapper slaMapper;

    public SlaServiceImpl(SlaRecordRepository slaRecordRepository, SlaMapper slaMapper) {
        this.slaRecordRepository = slaRecordRepository;
        this.slaMapper = slaMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SlaRecordResponse> getSlaRecords(SlaQuery query) {
        String normalizedQuery = QueryUtils.normalizeSearch(query.q());
        SlaState state = parseState(query.state());

        return slaRecordRepository.searchRecords(
                        normalizedQuery,
                        QueryUtils.isBlank(query.team()) ? null : query.team().trim(),
                        state
                ).stream()
                .sorted(Comparator.comparing(record -> record.getResolutionTargetAt()))
                .map(slaMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SlaRecordResponse> getBreachedRecords() {
        return slaRecordRepository.findByBreachedTrueOrderByResolutionTargetAtAsc().stream()
                .map(slaMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SlaSummaryResponse getSummary() {
        List<com.supportops.backend.entity.SlaRecord> records = slaRecordRepository.findAllWithTicketContext();
        if (records.isEmpty()) {
            records = slaRecordRepository.findAll();
        }
        long averageResolutionMinutes = Math.round(records.stream()
                .mapToLong(record -> Duration.between(record.getTicket().getCreatedAt(), record.getResolutionTargetAt()).toMinutes())
                .average()
                .orElse(0));

        return new SlaSummaryResponse(
                slaRecordRepository.countByState(SlaState.ON_TRACK),
                slaRecordRepository.countByState(SlaState.DUE_SOON),
                slaRecordRepository.countByState(SlaState.BREACHED),
                averageResolutionMinutes
        );
    }

    private SlaState parseState(String state) {
        try {
            return SlaState.valueOf(state.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid SLA state filter.");
        }
    }
}
