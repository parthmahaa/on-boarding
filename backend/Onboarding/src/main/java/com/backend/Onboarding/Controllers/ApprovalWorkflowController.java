package com.backend.Onboarding.Controllers;

import com.backend.Onboarding.Config.ResponseWrapper;
import com.backend.Onboarding.DTO.ApprovalWorkflowDTO;
import com.backend.Onboarding.services.ApprovalWorkflowService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Locale;
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

    @PutMapping("/{id}")
    public ResponseEntity<?> updateApprovalWorkflow(
            @PathVariable  String id,
            @Valid @RequestBody ApprovalWorkflowDTO dto) {
        UUID companyId;
        try {
            companyId = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid company ID format: " + id, e);
        }
        try {
            ApprovalWorkflowDTO updatedWorkflow = approvalWorkflowService.updateApprovalWorkflow(companyId, dto);
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.OK.value(),
                    "Approval workflow updated successfully",
                    updatedWorkflow,
                    false
            ), HttpStatus.OK);
        } catch (HttpMessageNotReadableException e) {
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.BAD_REQUEST.value(),
                    "JSON Parse Error: " + e.getMessage(),
                    null,
                    true
            ), HttpStatus.BAD_REQUEST);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.NOT_FOUND.value(),
                    e.getMessage(),
                    null,
                    true
            ), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "SERVER ERROR: " + e.getMessage(),
                    null,
                    true
            ), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
