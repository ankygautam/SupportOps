import { apiRequest, type QueryValue } from "@/api/client";
import type {
  TicketCommentDto,
  TicketCommentRequestDto,
  TicketCreateRequestDto,
  TicketDetailDto,
  TicketSummaryDto,
  TicketUpdateRequestDto,
} from "@/types/api";

export interface TicketListQuery {
  [key: string]: QueryValue;
  q?: string;
  status?: string;
  priority?: string;
  assignedAgentId?: string;
  customerId?: string;
  slaState?: string;
}

export async function getTickets(query?: TicketListQuery) {
  return apiRequest<TicketSummaryDto[]>("/api/tickets", undefined, query);
}

export async function getTicket(id: string) {
  return apiRequest<TicketDetailDto>(`/api/tickets/${id}`);
}

export async function createTicket(payload: TicketCreateRequestDto) {
  return apiRequest<TicketSummaryDto>("/api/tickets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTicket(id: string, payload: TicketUpdateRequestDto) {
  return apiRequest<TicketSummaryDto>(`/api/tickets/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getTicketComments(id: string) {
  return apiRequest<TicketCommentDto[]>(`/api/tickets/${id}/comments`);
}

export async function createTicketComment(id: string, payload: TicketCommentRequestDto) {
  return apiRequest<TicketCommentDto>(`/api/tickets/${id}/comments`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
