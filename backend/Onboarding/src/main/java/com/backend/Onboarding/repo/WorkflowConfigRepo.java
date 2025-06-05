package com.backend.Onboarding.repo;

import com.backend.Onboarding.entities.WorkflowConfig.WorkflowConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkflowConfigRepo extends JpaRepository<WorkflowConfiguration,Long> {
    List<WorkflowConfiguration> findByCompanyCompanyId(UUID companyId);
}
