package com.backend.Onboarding.Controllers;

import com.backend.Onboarding.Config.ResponseWrapper;
import com.backend.Onboarding.DTO.ApprovalWorkflowDTO;
import com.backend.Onboarding.services.ApprovalWorkflowService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/approval")
public class ApprovalWorkflowController {

    private final ApprovalWorkflowService approvalWorkflowService;

    public ApprovalWorkflowController(ApprovalWorkflowService approvalWorkflowService) {
        this.approvalWorkflowService = approvalWorkflowService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApprovalWorflow(@PathVariable String id){

        UUID companyId;
        try {
            companyId = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid company ID format: " + id, e);
        }

        ApprovalWorkflowDTO dto =approvalWorkflowService.getApprovalWorkflowByCompanyId(companyId);

        return new ResponseEntity<>(new ResponseWrapper(
                LocalDateTime.now(),
                HttpStatus.OK.value(),
                "Fetched Workflow",
                dto,
                false
                ),HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<?> addApprovalWorkflow(@RequestBody ApprovalWorkflowDTO dto){

        if(dto == null){
            throw new RuntimeException("Receieved Null data");
        }
        ApprovalWorkflowDTO approvalWorkflow = approvalWorkflowService.createApprovalWorkflow(dto);

        return new ResponseEntity<>(new ResponseWrapper<>(
                LocalDateTime.now(),
                HttpStatus.OK.value(),
                "Approval Workflow Created",
                approvalWorkflow,
                false
        ),HttpStatus.OK);
    }
}
