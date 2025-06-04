package com.backend.Onboarding.services;

import com.backend.Onboarding.DTO.ApprovalWorkflowDTO;
import com.backend.Onboarding.entities.ApprovalWorkflow;
import com.backend.Onboarding.entities.CompanyEntity;
import com.backend.Onboarding.repo.ApprovalWorkflowRepo;
import com.backend.Onboarding.repo.CompanyRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ApprovalWorkflowService {

    private final ApprovalWorkflowRepo approvalWorkflowRepo;
    private final CompanyRepo companyRepo;

    public ApprovalWorkflowService(ApprovalWorkflowRepo approvalWorkflowRepo, CompanyRepo companyRepo) {
        this.approvalWorkflowRepo = approvalWorkflowRepo;
        this.companyRepo = companyRepo;
    }

    @Transactional
    public ApprovalWorkflowDTO createApprovalWorkflow(ApprovalWorkflowDTO dto) {
        // Create a new ApprovalWorkflow entity
        ApprovalWorkflow workflow = mapToApprovalWorkflow(dto);
        try{
            ApprovalWorkflow savedWorkflow =  approvalWorkflowRepo.save(workflow);
            return mapToWorkflowDTO(savedWorkflow);
        }catch (Exception e){
            throw new RuntimeException("Failed to save:" +e.getMessage());
        }
    }

    public ApprovalWorkflowDTO getApprovalWorkflowByCompanyId(UUID companyId){
        try{
            CompanyEntity company = companyRepo.findById(companyId)
                    .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + companyId));

            ApprovalWorkflow workflow = approvalWorkflowRepo.findByCompanyId(companyId)
                    .orElseThrow(() -> new IllegalArgumentException("Approval workflow not found for company ID: " + companyId));

            return mapToWorkflowDTO(workflow);
        }catch (Exception e){
            throw new RuntimeException("Failed to fetch:" +e.getMessage());
        }
    }

    public ApprovalWorkflowDTO updateApprovalWorkflow(UUID companyId, ApprovalWorkflowDTO dto) {
        CompanyEntity company = companyRepo.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + companyId));

        ApprovalWorkflow workflow = approvalWorkflowRepo.findByCompanyId(companyId)
                .orElse(null);

        if (workflow == null) {
            // Create new workflow
            workflow = new ApprovalWorkflow();
            workflow.setCompany(company);
        }

        workflow.setLoan(dto.getLoan());
        workflow.setAttendanceRequest(dto.getAttendanceRequest());
        workflow.setExpenseClaimInAdvance(dto.getExpenseClaimInAdvance());
        workflow.setLeaveAndCOff(dto.getLeaveAndCOff());
        workflow.setShiftChangeRequest(dto.getShiftChangeRequest());
        workflow.setAssets(dto.getAssets());
        workflow.setOverTimeApproval(dto.getOverTimeApproval());
        workflow.setAdvance(dto.getAdvance());
        workflow.setAttendanceRegularization(dto.getAttendanceRegularization());
        workflow.setResignationRequest(dto.getResignationRequest());
        workflow.setExpenseClaim(dto.getExpenseClaim());
        workflow.setPendingTravelExpense(dto.getPendingTravelExpense());
        workflow.setTravel(dto.getTravel());

        ApprovalWorkflow savedWorkflow = approvalWorkflowRepo.save(workflow);
        return mapToWorkflowDTO(savedWorkflow);
    }


    //at the time of creation DTO-->Entity
    public ApprovalWorkflow mapToApprovalWorkflow(ApprovalWorkflowDTO dto){
        ApprovalWorkflow workflow = new ApprovalWorkflow();
        CompanyEntity company = companyRepo.findById(UUID.fromString(dto.getCompanyId()))
                .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + dto.getCompanyId()));

        workflow.setCompany(company);
        workflow.setLoan(dto.getLoan());
        workflow.setAttendanceRequest(dto.getAttendanceRequest());
        workflow.setExpenseClaimInAdvance(dto.getExpenseClaimInAdvance());
        workflow.setLeaveAndCOff(dto.getLeaveAndCOff());
        workflow.setShiftChangeRequest(dto.getShiftChangeRequest());
        workflow.setAssets(dto.getAssets());
        workflow.setOverTimeApproval(dto.getOverTimeApproval());
        workflow.setAdvance(dto.getAdvance());
        workflow.setAttendanceRegularization(dto.getAttendanceRegularization());
        workflow.setResignationRequest(dto.getResignationRequest());
        workflow.setExpenseClaim(dto.getExpenseClaim());
        workflow.setPendingTravelExpense(dto.getPendingTravelExpense());
        workflow.setTravel(dto.getTravel());

        return workflow;
    }

    public ApprovalWorkflowDTO mapToWorkflowDTO(ApprovalWorkflow workflow){
        ApprovalWorkflowDTO dto = new ApprovalWorkflowDTO();
        dto.setCompanyId(workflow.getCompany().getCompanyId().toString());
        dto.setLoan(workflow.getLoan());
        dto.setAttendanceRequest(workflow.getAttendanceRequest());
        dto.setExpenseClaim(workflow.getExpenseClaim());
        dto.setLeaveAndCOff(workflow.getLeaveAndCOff());
        dto.setShiftChangeRequest(workflow.getShiftChangeRequest());
        dto.setAssets(workflow.getAssets());
        dto.setOverTimeApproval(workflow.getOverTimeApproval());
        dto.setAdvance(workflow.getAdvance());
        dto.setAttendanceRegularization(workflow.getAttendanceRegularization());
        dto.setResignationRequest(workflow.getResignationRequest());
        dto.setExpenseClaim(workflow.getExpenseClaim());
        dto.setPendingTravelExpense(workflow.getPendingTravelExpense());
        dto.setTravel(workflow.getTravel());
        dto.setExpenseClaimInAdvance(workflow.getExpenseClaimInAdvance());

        return dto;
    }

}