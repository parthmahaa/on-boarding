package com.backend.Onboarding.Controllers;

import com.backend.Onboarding.Config.ResponseWrapper;
import com.backend.Onboarding.DTO.WorkflowConfigurationDTO;
import com.backend.Onboarding.services.WorkflowConfigurationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/workflow-configuration")
public class WorkflowConfigurationController {


    public WorkflowConfigurationController(WorkflowConfigurationService service) {
        this.service = service;
    }

    private final WorkflowConfigurationService service;

    // Add Workflow Configuration for a specific company
    @PostMapping("/add/{id}")
    public ResponseEntity<?> addWorkflowConfiguration(@PathVariable String id, @RequestBody WorkflowConfigurationDTO dto) {
        UUID companyId;
        try {
            companyId = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid company ID format: " + id, e);
        }
        try {
            WorkflowConfigurationDTO savedDto = service.addWorkflowConfiguration(companyId, dto);
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.CREATED.value(),
                    "Workflow Configurtion added",
                    savedDto,false
                    ),HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error:" + e.getMessage());
        }
    }

    // Get Workflow Configurations for a specific company
    @GetMapping("/{id}")
    public ResponseEntity<?> getWorkflowConfigurationsByCompanyId(@PathVariable String id) {
        UUID companyId;
        try {
            companyId = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid company ID format: " + id, e);
        }
        try {
            List<WorkflowConfigurationDTO> configurations = service.getWorkflowConfigurationsByCompanyId(companyId);
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.OK.value(),
                    "Configurations fetched",
                    configurations,
                    false
            ),HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    e.getMessage(),
                    null,
                    true
            ),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}