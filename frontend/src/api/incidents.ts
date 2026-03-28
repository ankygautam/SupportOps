import { apiRequest, type QueryValue } from "@/api/client";
import type {
  IncidentCreateRequestDto,
  IncidentDetailDto,
  IncidentSummaryDto,
  IncidentUpdateRequestDto,
} from "@/types/api";

export interface IncidentListQuery {
  [key: string]: QueryValue;
  q?: string;
  severity?: string;
  status?: string;
}

export async function getIncidents(query?: IncidentListQuery) {
  return apiRequest<IncidentSummaryDto[]>("/api/incidents", undefined, query);
}

export async function getIncident(id: string) {
  return apiRequest<IncidentDetailDto>(`/api/incidents/${id}`);
}

export async function createIncident(payload: IncidentCreateRequestDto) {
  return apiRequest<IncidentSummaryDto>("/api/incidents", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateIncident(id: string, payload: IncidentUpdateRequestDto) {
  return apiRequest<IncidentSummaryDto>(`/api/incidents/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
