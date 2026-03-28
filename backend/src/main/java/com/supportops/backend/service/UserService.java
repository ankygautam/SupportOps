package com.supportops.backend.service;

import com.supportops.backend.dto.common.UserSummaryResponse;
import com.supportops.backend.dto.user.TeamMemberResponse;
import com.supportops.backend.dto.user.UpdateUserRoleRequest;
import com.supportops.backend.dto.user.UpdateUserPreferencesRequest;
import com.supportops.backend.dto.user.UpdateUserStatusRequest;
import com.supportops.backend.dto.user.UserPreferencesResponse;
import java.util.List;

public interface UserService {

    List<UserSummaryResponse> getActiveUsers();

    UserPreferencesResponse getMyPreferences();

    UserPreferencesResponse updateMyPreferences(UpdateUserPreferencesRequest request);

    List<TeamMemberResponse> getTeamMembers(String role);

    TeamMemberResponse updateUserRole(String userId, UpdateUserRoleRequest request);

    TeamMemberResponse updateUserStatus(String userId, UpdateUserStatusRequest request);
}
