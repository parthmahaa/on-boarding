package com.backend.Onboarding.repo;

import com.backend.Onboarding.entities.CompanyEntity;
import com.backend.Onboarding.entities.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ManagerRepo extends JpaRepository<Manager, String> {
    List<Manager> findByCompany(CompanyEntity company);

    // Find all managers by company ID with explicit query
    @Query("SELECT m FROM Manager m WHERE m.company.id = :companyId")
    List<Manager> findByCompanyId(@Param("companyId") UUID companyId);
}
