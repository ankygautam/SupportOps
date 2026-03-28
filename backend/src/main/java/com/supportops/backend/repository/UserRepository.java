package com.supportops.backend.repository;

import com.supportops.backend.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmailIgnoreCase(String email);

    List<User> findByRoleNameOrderByFullNameAsc(com.supportops.backend.enums.RoleType roleType);

    List<User> findByActiveTrueOrderByFullNameAsc();

    List<User> findAllByOrderByFullNameAsc();
}
