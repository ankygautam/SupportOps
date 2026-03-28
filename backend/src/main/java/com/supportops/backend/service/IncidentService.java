package com.supportops.backend.service;

import com.supportops.backend.dto.incident.CreateIncidentRequest;
import com.supportops.backend.dto.incident.IncidentDetailResponse;
import com.supportops.backend.dto.incident.IncidentQuery;
import com.supportops.backend.dto.incident.IncidentSummaryResponse;
import com.supportops.backend.dto.incident.UpdateIncidentRequest;
import java.util.List;

public interface IncidentService {

    List<IncidentSummaryResponse> getIncidents(IncidentQuery query);

    IncidentDetailResponse getIncident(String id);

    IncidentSummaryResponse createIncident(CreateIncidentRequest request);

    IncidentSummaryResponse updateIncident(String id, UpdateIncidentRequest request);
}
