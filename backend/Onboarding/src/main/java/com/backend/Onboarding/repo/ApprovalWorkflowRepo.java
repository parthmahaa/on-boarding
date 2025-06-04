package com.backend.Onboarding.repo;

import com.backend.Onboarding.entities.ApprovalWorkflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApprovalWorkflowRepo extends JpaRepository<ApprovalWorkflow,Long> {

    @Query("SELECT aw FROM ApprovalWorkflow aw WHERE aw.company.companyId = :companyId")
    Optional<ApprovalWorkflow> findByCompanyId(@Param("companyId") UUID companyId);
}
