import { apiRequest, type QueryValue } from "@/api/client";
import type { SlaRecordDto, SlaSummaryDto } from "@/types/api";

export interface SlaListQuery {
  [key: string]: QueryValue;
  q?: string;
  team?: string;
  state?: string;
}

export async function getSla(query?: SlaListQuery) {
  return apiRequest<SlaRecordDto[]>("/api/sla", undefined, query);
}

export async function getBreachedSla() {
  return apiRequest<SlaRecordDto[]>("/api/sla/breached");
}

export async function getSlaSummary() {
  return apiRequest<SlaSummaryDto>("/api/sla/summary");
}
