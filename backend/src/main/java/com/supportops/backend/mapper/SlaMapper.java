package com.supportops.backend.mapper;

import com.supportops.backend.dto.sla.SlaRecordResponse;
import com.supportops.backend.entity.SlaRecord;
import org.springframework.stereotype.Component;

@Component
public class SlaMapper {

    public SlaRecordResponse toResponse(SlaRecord slaRecord) {
        return new SlaRecordResponse(
                slaRecord.getId(),
                slaRecord.getTicket().getId(),
                slaRecord.getTicket().getSubject(),
                slaRecord.getTicket().getCustomer().getCompany(),
                slaRecord.getTicket().getAssignedAgent() != null ? slaRecord.getTicket().getAssignedAgent().getFullName() : null,
                slaRecord.getTicket().getAssignedAgent() != null ? slaRecord.getTicket().getAssignedAgent().getTeam() : null,
                slaRecord.getFirstResponseTargetAt(),
                slaRecord.getResolutionTargetAt(),
                slaRecord.getState().name(),
                slaRecord.isBreached(),
                slaRecord.getUpdatedAt()
        );
    }
}
