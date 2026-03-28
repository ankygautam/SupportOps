package com.supportops.backend.service;

import com.supportops.backend.dto.sla.SlaQuery;
import com.supportops.backend.dto.sla.SlaRecordResponse;
import com.supportops.backend.dto.sla.SlaSummaryResponse;
import java.util.List;

public interface SlaService {

    List<SlaRecordResponse> getSlaRecords(SlaQuery query);

    List<SlaRecordResponse> getBreachedRecords();

    SlaSummaryResponse getSummary();
}
