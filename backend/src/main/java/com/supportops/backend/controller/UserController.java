package com.supportops.backend.controller;

import com.supportops.backend.dto.common.UserSummaryResponse;
import com.supportops.backend.dto.user.TeamMemberResponse;
import com.supportops.backend.dto.user.UpdateUserRoleRequest;
import com.supportops.backend.dto.user.UpdateUserPreferencesRequest;
import com.supportops.backend.dto.user.UpdateUserStatusRequest;
import com.supportops.backend.dto.user.UserPreferencesResponse;
import com.supportops.backend.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserSummaryResponse>> getActiveUsers() {
        return ResponseEntity.ok(userService.getActiveUsers());
    }

    @GetMapping("/me/preferences")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserPreferencesResponse> getMyPreferences() {
        return ResponseEntity.ok(userService.getMyPreferences());
    }

    @PutMapping("/me/preferences")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserPreferencesResponse> updateMyPreferences(@Valid @RequestBody UpdateUserPreferencesRequest request) {
        return ResponseEntity.ok(userService.updateMyPreferences(request));
    }

    @GetMapping("/team")
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD')")
    public ResponseEntity<List<TeamMemberResponse>> getTeamMembers(@RequestParam(required = false) String role) {
        return ResponseEntity.ok(userService.getTeamMembers(role));
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeamMemberResponse> updateUserRole(@PathVariable("id") String userId, @Valid @RequestBody UpdateUserRoleRequest request) {
        return ResponseEntity.ok(userService.updateUserRole(userId, request));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD')")
    public ResponseEntity<TeamMemberResponse> updateUserStatus(@PathVariable("id") String userId, @RequestBody UpdateUserStatusRequest request) {
        return ResponseEntity.ok(userService.updateUserStatus(userId, request));
    }
}
