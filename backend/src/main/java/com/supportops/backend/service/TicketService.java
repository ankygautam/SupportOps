package com.supportops.backend.service;

import com.supportops.backend.dto.ticket.CreateTicketCommentRequest;
import com.supportops.backend.dto.ticket.CreateTicketRequest;
import com.supportops.backend.dto.ticket.TicketCommentResponse;
import com.supportops.backend.dto.ticket.TicketDetailResponse;
import com.supportops.backend.dto.ticket.TicketQuery;
import com.supportops.backend.dto.ticket.TicketSummaryResponse;
import com.supportops.backend.dto.ticket.TicketUpdateRequest;
import java.util.List;

public interface TicketService {

    List<TicketSummaryResponse> getTickets(TicketQuery query);

    TicketDetailResponse getTicket(String id);

    TicketSummaryResponse createTicket(CreateTicketRequest request);

    TicketSummaryResponse updateTicket(String id, TicketUpdateRequest request);

    List<TicketCommentResponse> getComments(String ticketId);

    TicketCommentResponse addComment(String ticketId, CreateTicketCommentRequest request);
}
