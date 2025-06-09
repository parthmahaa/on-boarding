package com.backend.Onboarding.entities.WorkflowConfig;

import com.backend.Onboarding.entities.CompanyEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "tbl_workflow_config")
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

    @OneToMany(mappedBy = "workflowConfiguration", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NoticePeriodMember> noticePeriodMembers = new ArrayList<>();

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

    @OneToMany(mappedBy = "workflowConfiguration", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProbationMembers> probationMembers = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonBackReference(value = "company-workflow-config")
    private CompanyEntity company;
}