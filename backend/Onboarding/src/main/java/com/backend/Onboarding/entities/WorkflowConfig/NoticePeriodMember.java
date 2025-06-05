package com.backend.Onboarding.entities.WorkflowConfig;

import com.backend.Onboarding.entities.WorkflowConfig.WorkflowConfiguration;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "notice_period_members")
public class NoticePeriodMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // e.g., "branch", "employee", etc.
    private String values; // Comma-separated values, e.g., "Branch A,Branch B"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_config_id", nullable = false)
    private WorkflowConfiguration workflowConfiguration;
}