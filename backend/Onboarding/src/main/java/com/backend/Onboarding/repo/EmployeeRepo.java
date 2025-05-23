package com.backend.Onboarding.repo;

import com.backend.Onboarding.entities.Employees;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EmployeeRepo extends JpaRepository<Employees, Long> {
    boolean existsByEmployeeEmail(String email);
}
