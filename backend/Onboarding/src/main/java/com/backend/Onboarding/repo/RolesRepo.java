package com.backend.Onboarding.repo;

import com.backend.Onboarding.entities.Roles;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolesRepo extends JpaRepository<Roles, Long> {
    Optional<Roles> findByRoleName(String roleName);
}
