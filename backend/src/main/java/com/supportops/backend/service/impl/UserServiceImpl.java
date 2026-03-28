package com.supportops.backend.service.impl;

import com.supportops.backend.dto.common.UserSummaryResponse;
import com.supportops.backend.dto.user.TeamMemberResponse;
import com.supportops.backend.dto.user.UpdateUserPreferencesRequest;
import com.supportops.backend.dto.user.UpdateUserRoleRequest;
import com.supportops.backend.dto.user.UpdateUserStatusRequest;
import com.supportops.backend.dto.user.UserPreferencesResponse;
import com.supportops.backend.entity.Role;
import com.supportops.backend.entity.Ticket;
import com.supportops.backend.entity.User;
import com.supportops.backend.entity.UserPreference;
import com.supportops.backend.enums.RoleType;
import com.supportops.backend.enums.TicketStatus;
import com.supportops.backend.exception.BadRequestException;
import com.supportops.backend.exception.ResourceNotFoundException;
import com.supportops.backend.mapper.UserMapper;
import com.supportops.backend.repository.RoleRepository;
import com.supportops.backend.repository.TicketRepository;
import com.supportops.backend.repository.UserPreferenceRepository;
import com.supportops.backend.repository.UserRepository;
import com.supportops.backend.service.UserService;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TicketRepository ticketRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final UserMapper userMapper;

    public UserServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            TicketRepository ticketRepository,
            UserPreferenceRepository userPreferenceRepository,
            UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.ticketRepository = ticketRepository;
        this.userPreferenceRepository = userPreferenceRepository;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSummaryResponse> getActiveUsers() {
        return userRepository.findByActiveTrueOrderByFullNameAsc().stream()
                .map(userMapper::toSummary)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserPreferencesResponse getMyPreferences() {
        User user = currentUser();
        UserPreference preference = getPreference(user.getId());
        return userMapper.toPreferences(user, preference);
    }

    @Override
    @Transactional
    public UserPreferencesResponse updateMyPreferences(UpdateUserPreferencesRequest request) {
        User user = currentUser();
        UserPreference preference = getPreference(user.getId());
        userMapper.applyPreferences(preference, request);
        UserPreference savedPreference = userPreferenceRepository.save(preference);
        return userMapper.toPreferences(user, savedPreference);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamMemberResponse> getTeamMembers(String role) {
        List<User> users = role == null || role.isBlank()
                ? userRepository.findAllByOrderByFullNameAsc()
                : userRepository.findByRoleNameOrderByFullNameAsc(RoleType.valueOf(role.toUpperCase()));

        Instant oneWeekAgo = Instant.now().minus(7, ChronoUnit.DAYS);

        return users.stream()
                .map(user -> {
                    List<Ticket> assignedTickets = ticketRepository.findByAssignedAgentId(user.getId());
                    long activeTickets = assignedTickets.stream()
                            .filter(ticket -> ticket.getStatus() != TicketStatus.RESOLVED && ticket.getStatus() != TicketStatus.CLOSED)
                            .count();
                    long resolvedThisWeek = assignedTickets.stream()
                            .filter(ticket -> ticket.getResolvedAt() != null && ticket.getResolvedAt().isAfter(oneWeekAgo))
                            .count();
                    long averageResponseMinutes = assignedTickets.isEmpty()
                            ? 24
                            : Math.max(12L, Math.round(
                                    assignedTickets.stream()
                                            .mapToLong(ticket -> switch (ticket.getPriority()) {
                                                case CRITICAL -> 18;
                                                case HIGH -> 27;
                                                case MEDIUM -> 46;
                                                case LOW -> 72;
                                            })
                                            .average()
                                            .orElse(24)));

                    return userMapper.toTeamMember(user, activeTickets, resolvedThisWeek, averageResponseMinutes);
                })
                .toList();
    }

    @Override
    @Transactional
    public TeamMemberResponse updateUserRole(String userId, UpdateUserRoleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        Role role = roleRepository.findByName(request.role())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found."));
        user.setRole(role);
        User savedUser = userRepository.save(user);
        return buildTeamMember(savedUser);
    }

    @Override
    @Transactional
    public TeamMemberResponse updateUserStatus(String userId, UpdateUserStatusRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        if (!request.active()) {
            List<Ticket> assignedTickets = ticketRepository.findByAssignedAgentId(userId).stream()
                    .filter(ticket -> ticket.getStatus() != TicketStatus.RESOLVED && ticket.getStatus() != TicketStatus.CLOSED)
                    .toList();

            if (!assignedTickets.isEmpty()) {
                if (request.reassignToUserId() == null || request.reassignToUserId().isBlank()) {
                    throw new BadRequestException("Active tickets must be reassigned before a user can be deactivated.");
                }
                User reassignee = userRepository.findById(request.reassignToUserId())
                        .orElseThrow(() -> new ResourceNotFoundException("Reassignment user not found."));
                for (Ticket ticket : assignedTickets) {
                    ticket.setAssignedAgent(reassignee);
                }
                ticketRepository.saveAll(assignedTickets);
            }
        }

        user.setActive(request.active());
        User savedUser = userRepository.save(user);
        return buildTeamMember(savedUser);
    }

    private TeamMemberResponse buildTeamMember(User user) {
        List<Ticket> assignedTickets = ticketRepository.findByAssignedAgentId(user.getId());
        long activeTickets = assignedTickets.stream()
                .filter(ticket -> ticket.getStatus() != TicketStatus.RESOLVED && ticket.getStatus() != TicketStatus.CLOSED)
                .count();
        long resolvedThisWeek = assignedTickets.stream()
                .filter(ticket -> ticket.getResolvedAt() != null && ticket.getResolvedAt().isAfter(Instant.now().minus(7, ChronoUnit.DAYS)))
                .count();
        long averageResponseMinutes = assignedTickets.isEmpty()
                ? 24
                : Math.max(12L, Math.round(
                        assignedTickets.stream()
                                .mapToLong(ticket -> switch (ticket.getPriority()) {
                                    case CRITICAL -> 18;
                                    case HIGH -> 27;
                                    case MEDIUM -> 46;
                                    case LOW -> 72;
                                })
                                .average()
                                .orElse(24)));
        return userMapper.toTeamMember(user, activeTickets, resolvedThisWeek, averageResponseMinutes);
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));
    }

    private UserPreference getPreference(String userId) {
        return userPreferenceRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User preferences not found."));
    }
}
