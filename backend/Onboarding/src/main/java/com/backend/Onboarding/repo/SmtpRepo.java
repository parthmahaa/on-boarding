package com.backend.Onboarding.repo;

import com.backend.Onboarding.entities.ApprovalWorkflow;
import com.backend.Onboarding.entities.SMTPConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface SmtpRepo extends JpaRepository<SMTPConfiguration, Long> {
    @Query("SELECT s FROM SMTPConfiguration s WHERE s.company.companyId = :companyId")
    Optional<SMTPConfiguration> findByCompanyCompanyId(@Param("companyId") UUID companyId);
}
