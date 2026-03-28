package com.supportops.backend.controller;

import com.supportops.backend.dto.ticket.CreateTicketCommentRequest;
import com.supportops.backend.dto.ticket.CreateTicketRequest;
import com.supportops.backend.dto.ticket.TicketCommentResponse;
import com.supportops.backend.dto.ticket.TicketDetailResponse;
import com.supportops.backend.dto.ticket.TicketQuery;
import com.supportops.backend.dto.ticket.TicketSummaryResponse;
import com.supportops.backend.dto.ticket.TicketUpdateRequest;
import com.supportops.backend.service.TicketService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD','SUPPORT_AGENT')")
    public ResponseEntity<List<TicketSummaryResponse>> getTickets(
            @RequestParam(required = false, name = "q") String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String assignedAgentId,
            @RequestParam(required = false) String customerId,
            @RequestParam(required = false) String slaState
    ) {
        return ResponseEntity.ok(ticketService.getTickets(new TicketQuery(q, status, priority, assignedAgentId, customerId, slaState)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD','SUPPORT_AGENT')")
    public ResponseEntity<TicketDetailResponse> getTicket(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicket(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD','SUPPORT_AGENT')")
    public TicketSummaryResponse createTicket(@Valid @RequestBody CreateTicketRequest request) {
        return ticketService.createTicket(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD')")
    public ResponseEntity<TicketSummaryResponse> updateTicket(@PathVariable String id, @Valid @RequestBody TicketUpdateRequest request) {
        return ResponseEntity.ok(ticketService.updateTicket(id, request));
    }

    @GetMapping("/{id}/comments")
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD','SUPPORT_AGENT')")
    public ResponseEntity<List<TicketCommentResponse>> getComments(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getComments(id));
    }

    @PostMapping("/{id}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD','SUPPORT_AGENT')")
    public TicketCommentResponse addComment(@PathVariable String id, @Valid @RequestBody CreateTicketCommentRequest request) {
        return ticketService.addComment(id, request);
    }
}
