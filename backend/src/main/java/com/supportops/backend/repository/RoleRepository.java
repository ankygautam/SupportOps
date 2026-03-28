package com.supportops.backend.repository;

import com.supportops.backend.entity.Role;
import com.supportops.backend.enums.RoleType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, String> {

    Optional<Role> findByName(RoleType name);
}
