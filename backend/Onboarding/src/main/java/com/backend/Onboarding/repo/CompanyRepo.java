package com.backend.Onboarding.repo;

import com.backend.Onboarding.entities.CompanyEntity;
import com.backend.Onboarding.entities.Employees;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CompanyRepo extends JpaRepository<CompanyEntity, UUID> {
    Optional<CompanyEntity> findOneByCompanyName(String companyName);
    boolean existsByCompanyName(String companyName); // Add this method
    List<Employees> findEmployeesByCompanyId(UUID companyId);
}
