package com.backend.Onboarding.entities;

import com.backend.Onboarding.utilities.ApprovalMode;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "approval_workflows")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalWorkflow {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonBackReference(value = "company-approval-workflows")
    private CompanyEntity company;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalMode loan;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalMode attendanceRequest;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalMode expenseClaimInAdvance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalMode leaveAndCOff;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalMode shiftChangeRequest;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalMode assets;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalMode overTimeApproval;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalMode advance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalMode attendanceRegularization;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalMode resignationRequest;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalMode expenseClaim;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalMode pendingTravelExpense;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalMode travel;
}