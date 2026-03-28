package com.supportops.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.supportops.backend.dto.sla.SlaQuery;
import com.supportops.backend.entity.Customer;
import com.supportops.backend.entity.SlaRecord;
import com.supportops.backend.entity.Ticket;
import com.supportops.backend.entity.User;
import com.supportops.backend.enums.SlaState;
import com.supportops.backend.enums.TicketPriority;
import com.supportops.backend.enums.TicketStatus;
import com.supportops.backend.exception.BadRequestException;
import com.supportops.backend.mapper.SlaMapper;
import com.supportops.backend.repository.SlaRecordRepository;
import com.supportops.backend.service.impl.SlaServiceImpl;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SlaServiceImplTest {

    private SlaRecordRepository slaRecordRepository;
    private SlaServiceImpl slaService;

    @BeforeEach
    void setUp() {
        slaRecordRepository = mock(SlaRecordRepository.class);
        slaService = new SlaServiceImpl(slaRecordRepository, new SlaMapper());
    }

    @Test
    void getSummaryReturnsCountsAndAverageResolutionWindow() {
        when(slaRecordRepository.findAll()).thenReturn(List.of(
                record("sla-1", "SUP-1", SlaState.ON_TRACK, Instant.parse("2026-03-28T12:00:00Z"), Instant.parse("2026-03-28T16:00:00Z")),
                record("sla-2", "SUP-2", SlaState.BREACHED, Instant.parse("2026-03-28T10:00:00Z"), Instant.parse("2026-03-28T18:00:00Z"))
        ));
        when(slaRecordRepository.countByState(SlaState.ON_TRACK)).thenReturn(4L);
        when(slaRecordRepository.countByState(SlaState.DUE_SOON)).thenReturn(2L);
        when(slaRecordRepository.countByState(SlaState.BREACHED)).thenReturn(1L);

        var summary = slaService.getSummary();

        assertThat(summary.onTrack()).isEqualTo(4);
        assertThat(summary.dueSoon()).isEqualTo(2);
        assertThat(summary.breached()).isEqualTo(1);
        assertThat(summary.averageResolutionMinutes()).isEqualTo(360);
    }

    @Test
    void getSlaRecordsRejectsUnknownStateFilters() {
        assertThatThrownBy(() -> slaService.getSlaRecords(new SlaQuery("", "", "not-a-state")))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Invalid SLA state filter.");
    }

    private SlaRecord record(String id, String ticketId, SlaState state, Instant createdAt, Instant resolutionTargetAt) {
        Customer customer = new Customer();
        customer.setId("cust-" + ticketId);
        customer.setCompany("Prairie Connect Services");

        User owner = new User();
        owner.setId("usr-" + ticketId);
        owner.setFullName("Daniel Kim");
        owner.setTeam("Core Support");

        Ticket ticket = new Ticket();
        ticket.setId(ticketId);
        ticket.setSubject("Billing portal returns 500 error");
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        ticket.setPriority(TicketPriority.HIGH);
        ticket.setCustomer(customer);
        ticket.setAssignedAgent(owner);
        ticket.setCreatedAt(createdAt);

        SlaRecord record = new SlaRecord();
        record.setId(id);
        record.setTicket(ticket);
        record.setFirstResponseTargetAt(createdAt.plusSeconds(1800));
        record.setResolutionTargetAt(resolutionTargetAt);
        record.setState(state);
        record.setBreached(state == SlaState.BREACHED);
        record.setUpdatedAt(createdAt.plusSeconds(600));
        return record;
    }
}
