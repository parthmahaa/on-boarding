package com.backend.Onboarding.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "workflow_config")
@AllArgsConstructor
@NoArgsConstructor
public class WorkflowConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String noticePeriodPolicyName;
    private LocalDate noticePeriodEffectiveDate;
    private Integer noticePeriodDuringProbation;
    private Integer noticePeriodAfterConfirmation;
    private String noticePeriodMembersType;
    private String noticePeriodMembersValues;

    // Department Clearance Fields
    private String departmentName;
    private String poc;
    private Boolean isReportingClearance;
    private String parentDepartment;
    private String departmentTasks;

    // Probation Setup Fields
    private String probationPolicyName;
    private LocalDate probationEffectiveDate;
    private Integer probationDays;
    private String probationMembersType; // e.g., "branch", "employee", etc.
    private String probationMembersValues;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonBackReference(value = "company-workflow-config")
    private CompanyEntity company;
}
