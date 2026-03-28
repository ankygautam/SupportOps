package com.supportops.backend.controller;

import com.supportops.backend.dto.sla.SlaQuery;
import com.supportops.backend.dto.sla.SlaRecordResponse;
import com.supportops.backend.dto.sla.SlaSummaryResponse;
import com.supportops.backend.service.SlaService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sla")
public class SlaController {

    private final SlaService slaService;

    public SlaController(SlaService slaService) {
        this.slaService = slaService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD')")
    public ResponseEntity<List<SlaRecordResponse>> getSla(
            @RequestParam(required = false, name = "q") String q,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String team,
            @RequestParam(required = false) String state
    ) {
        return ResponseEntity.ok(slaService.getSlaRecords(new SlaQuery(q != null ? q : search, team, state)));
    }

    @GetMapping("/breached")
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD')")
    public ResponseEntity<List<SlaRecordResponse>> getBreached() {
        return ResponseEntity.ok(slaService.getBreachedRecords());
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD')")
    public ResponseEntity<SlaSummaryResponse> getSummary() {
        return ResponseEntity.ok(slaService.getSummary());
    }
}
