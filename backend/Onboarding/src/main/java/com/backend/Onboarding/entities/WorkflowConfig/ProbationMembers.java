package com.backend.Onboarding.entities.WorkflowConfig;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "probation_members")
public class ProbationMembers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String values;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_config_id", nullable = false)
    private WorkflowConfiguration workflowConfiguration;
}