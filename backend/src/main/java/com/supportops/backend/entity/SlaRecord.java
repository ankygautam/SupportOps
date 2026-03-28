package com.supportops.backend.entity;

import com.supportops.backend.enums.SlaState;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "sla_records")
public class SlaRecord extends BaseEntity {

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ticket_id", nullable = false, unique = true)
    private Ticket ticket;

    @Column(nullable = false)
    private Instant firstResponseTargetAt;

    @Column(nullable = false)
    private Instant resolutionTargetAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private SlaState state;

    @Column(nullable = false)
    private boolean breached;

    @PrePersist
    void prePersist() {
        ensureId();
    }

    public SlaRecord() {
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public Instant getFirstResponseTargetAt() {
        return firstResponseTargetAt;
    }

    public void setFirstResponseTargetAt(Instant firstResponseTargetAt) {
        this.firstResponseTargetAt = firstResponseTargetAt;
    }

    public Instant getResolutionTargetAt() {
        return resolutionTargetAt;
    }

    public void setResolutionTargetAt(Instant resolutionTargetAt) {
        this.resolutionTargetAt = resolutionTargetAt;
    }

    public SlaState getState() {
        return state;
    }

    public void setState(SlaState state) {
        this.state = state;
    }

    public boolean isBreached() {
        return breached;
    }

    public void setBreached(boolean breached) {
        this.breached = breached;
    }
}
