package com.supportops.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.supportops.backend.dto.ticket.TicketSummaryResponse;
import com.supportops.backend.exception.GlobalExceptionHandler;
import com.supportops.backend.service.TicketService;
import java.time.Instant;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

class TicketControllerTest {

    private MockMvc mockMvc;
    private TicketService ticketService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        ticketService = mock(TicketService.class);
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        mockMvc = MockMvcBuilders.standaloneSetup(new TicketController(ticketService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .setValidator(validator)
                .build();
    }

    @Test
    void createTicketReturnsCreatedWhenPayloadIsValid() throws Exception {
        when(ticketService.createTicket(any())).thenReturn(new TicketSummaryResponse(
                "SUP-4001",
                "Billing portal returns 500 error",
                "Description",
                "NEW",
                "HIGH",
                "cust-1",
                "Marlon Hayes",
                "Prairie Connect Services",
                "usr-2",
                "Daniel Kim",
                null,
                null,
                false,
                null,
                null,
                Instant.now().plusSeconds(3600),
                null,
                null,
                null,
                Instant.now(),
                Instant.now(),
                "ON_TRACK"
        ));

        mockMvc.perform(post("/api/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "subject", "Billing portal returns 500 error",
                                "description", "Finance users cannot export invoices.",
                                "customerId", "cust-1",
                                "priority", "HIGH",
                                "status", "NEW",
                                "assignedAgentId", "usr-2",
                                "dueAt", Instant.now().plusSeconds(7200).toString()
                        ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("SUP-4001"));
    }

    @Test
    void createTicketReturnsValidationErrorWhenSubjectMissing() throws Exception {
        mockMvc.perform(post("/api/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "description", "Finance users cannot export invoices.",
                                "customerId", "cust-1",
                                "priority", "HIGH",
                                "status", "NEW",
                                "assignedAgentId", "usr-2",
                                "dueAt", Instant.now().plusSeconds(7200).toString()
                        ))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed."));
    }
}
