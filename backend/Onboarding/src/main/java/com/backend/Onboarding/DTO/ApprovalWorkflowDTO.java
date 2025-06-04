package com.backend.Onboarding.DTO;

import com.backend.Onboarding.utilities.ApprovalMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApprovalWorkflowDTO {

    private String companyId;

    @NotNull(message = "Loan approval mode is required")
    private ApprovalMode loan;

    @NotNull(message = "Attendance request approval mode is required")
    private ApprovalMode attendanceRequest;

    @NotNull(message = "Expense claim in advance approval mode is required")
    private ApprovalMode expenseClaimInAdvance;

    @NotNull(message = "Leave and C-Off approval mode is required")
    private ApprovalMode leaveAndCOff;

    @NotNull(message = "Shift change request approval mode is required")
    private ApprovalMode shiftChangeRequest;

    @NotNull(message = "Assets approval mode is required")
    private ApprovalMode assets;

    @NotNull(message = "Over time approval mode is required")
    private ApprovalMode overTimeApproval;

    @NotNull(message = "Advance approval mode is required")
    private ApprovalMode advance;

    @NotNull(message = "Attendance regularization approval mode is required")
    private ApprovalMode attendanceRegularization;

    @NotNull(message = "Resignation request approval mode is required")
    private ApprovalMode resignationRequest;

    @NotNull(message = "Expense claim approval mode is required")
    private ApprovalMode expenseClaim;

    @NotNull(message = "Pending travel expense approval mode is required")
    private ApprovalMode pendingTravelExpense;

    @NotNull(message = "Travel approval mode is required")
    private ApprovalMode travel;
}