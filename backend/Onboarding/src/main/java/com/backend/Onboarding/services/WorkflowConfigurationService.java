package com.backend.Onboarding.services;

import com.backend.Onboarding.DTO.WorkflowConfigurationDTO;
import com.backend.Onboarding.entities.CompanyEntity;
import com.backend.Onboarding.entities.WorkflowConfig.NoticePeriodMember;
import com.backend.Onboarding.entities.WorkflowConfig.ProbationMembers;
import com.backend.Onboarding.entities.WorkflowConfig.WorkflowConfiguration;
import com.backend.Onboarding.repo.CompanyRepo;
import com.backend.Onboarding.repo.WorkflowConfigRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WorkflowConfigurationService {

    @Autowired
    private WorkflowConfigRepo workflowConfigRepository;

    @Autowired
    private CompanyRepo companyRepository;

    // Add Workflow Configuration for a specific company
    public WorkflowConfigurationDTO addWorkflowConfiguration(UUID companyId, WorkflowConfigurationDTO dto) throws IllegalArgumentException {
        // Find the company
        CompanyEntity company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company with ID " + companyId + " not found"));

        // Validate Notice Period
        if (dto.getNoticePeriod() != null) {
            WorkflowConfigurationDTO.NoticePeriodDTO np = dto.getNoticePeriod();
            if (np.getPolicyName() == null || np.getPolicyName().isEmpty()) {
                throw new IllegalArgumentException("Notice period policy name cannot be empty");
            }
            if (np.getEffectiveDate() == null) {
                throw new IllegalArgumentException("Notice period effective date cannot be null");
            }
            if (np.getNoticePeriodDuringProbation() == null || np.getNoticePeriodDuringProbation() < 0) {
                throw new IllegalArgumentException("Notice period during probation must be non-negative");
            }
            if (np.getNoticePeriodAfterConfirmation() == null || np.getNoticePeriodAfterConfirmation() < 0) {
                throw new IllegalArgumentException("Notice period after confirmation must be non-negative");
            }
            if (np.getNoticePeriodMembers() != null && !np.getNoticePeriodMembers().isEmpty()) {
                for (WorkflowConfigurationDTO.MembersDTO member : np.getNoticePeriodMembers()) {
                    if (member.getType() == null || member.getType().isEmpty()) {
                        throw new IllegalArgumentException("Notice period member type cannot be empty");
                    }
                    if (member.getValues() == null || member.getValues().isEmpty()) {
                        throw new IllegalArgumentException("Notice period member values cannot be empty for type: " + member.getType());
                    }
                }
            }
        }

        // Validate Department Clearance
        if (dto.getDepartmentClearance() != null) {
            WorkflowConfigurationDTO.DepartmentClearanceDTO dc = dto.getDepartmentClearance();
            if (dc.getDepartmentName() == null || dc.getDepartmentName().isEmpty()) {
                throw new IllegalArgumentException("Department name cannot be empty");
            }
            if (dc.getPoc() == null || dc.getPoc().isEmpty()) {
                throw new IllegalArgumentException("POC cannot be empty");
            }
            if (dc.getDepartmentTasks() == null || dc.getDepartmentTasks().isEmpty()) {
                throw new IllegalArgumentException("Department clearance tasks cannot be empty");
            }
        }

        // Validate Probation Setup
        if (dto.getProbationSetup() != null) {
            WorkflowConfigurationDTO.ProbationSetupDTO ps = dto.getProbationSetup();
            if (ps.getPolicyName() == null || ps.getPolicyName().isEmpty()) {
                throw new IllegalArgumentException("Probation policy name cannot be empty");
            }
            if (ps.getEffectiveDate() == null) {
                throw new IllegalArgumentException("Probation effective date cannot be null");
            }
            if (ps.getProbationDays() < 0) {
                throw new IllegalArgumentException("Probation days must be non-negative");
            }
            if (ps.getProbationMembers() != null && !ps.getProbationMembers().isEmpty()) {
                for (WorkflowConfigurationDTO.MembersDTO member : ps.getProbationMembers()) {
                    if (member.getType() == null || member.getType().isEmpty()) {
                        throw new IllegalArgumentException("Probation member type cannot be empty");
                    }
                    if (member.getValues() == null || member.getValues().isEmpty()) {
                        throw new IllegalArgumentException("Probation member values cannot be empty for type: " + member.getType());
                    }
                }
            }
        }

        // Convert DTO to Entity
        WorkflowConfiguration entity = new WorkflowConfiguration();
        entity.setCompany(company);

        // Notice Period
        if (dto.getNoticePeriod() != null) {
            WorkflowConfigurationDTO.NoticePeriodDTO np = dto.getNoticePeriod();
            entity.setNoticePeriodPolicyName(np.getPolicyName());
            entity.setNoticePeriodEffectiveDate(np.getEffectiveDate());
            entity.setNoticePeriodDuringProbation(np.getNoticePeriodDuringProbation());
            entity.setNoticePeriodAfterConfirmation(np.getNoticePeriodAfterConfirmation());

            if (np.getNoticePeriodMembers() != null && !np.getNoticePeriodMembers().isEmpty()) {
                List<NoticePeriodMember> members = new ArrayList<>();
                for (WorkflowConfigurationDTO.MembersDTO memberDTO : np.getNoticePeriodMembers()) {
                    NoticePeriodMember member = new NoticePeriodMember();
                    member.setType(memberDTO.getType());
                    member.setValues(String.join(",", memberDTO.getValues()));
                    member.setWorkflowConfiguration(entity);
                    members.add(member);
                }
                entity.setNoticePeriodMembers(members);
            }
        }

        // Department Clearance
        if (dto.getDepartmentClearance() != null) {
            WorkflowConfigurationDTO.DepartmentClearanceDTO dc = dto.getDepartmentClearance();
            entity.setDepartmentName(dc.getDepartmentName());
            entity.setPoc(dc.getPoc());
            entity.setIsReportingClearance(dc.getIsReportingClearance());
            entity.setParentDepartment(dc.getParentDepartment());
            entity.setDepartmentTasks(dc.getDepartmentTasks());
        }

        // Probation Setup
        if (dto.getProbationSetup() != null) {
            WorkflowConfigurationDTO.ProbationSetupDTO ps = dto.getProbationSetup();
            entity.setProbationPolicyName(ps.getPolicyName());
            entity.setProbationEffectiveDate(ps.getEffectiveDate());
            entity.setProbationDays(ps.getProbationDays());

            if (ps.getProbationMembers() != null && !ps.getProbationMembers().isEmpty()) {
                List<ProbationMembers> members = new ArrayList<>();
                for (WorkflowConfigurationDTO.MembersDTO memberDTO : ps.getProbationMembers()) {
                    ProbationMembers member = new ProbationMembers();
                    member.setType(memberDTO.getType());
                    member.setValues(String.join(",", memberDTO.getValues()));
                    member.setWorkflowConfiguration(entity);
                    members.add(member);
                }
                entity.setProbationMembers(members);
            }
        }

        // Save to repository
        workflowConfigRepository.save(entity);
        return dto;
    }

    // Get Workflow Configurations for a specific company
    public List<WorkflowConfigurationDTO> getWorkflowConfigurationsByCompanyId(UUID companyId) {
        List<WorkflowConfiguration> entities = workflowConfigRepository.findByCompanyCompanyId(companyId);
        return entities.stream().map(entity -> {
            WorkflowConfigurationDTO dto = new WorkflowConfigurationDTO();

            // Notice Period
            if (entity.getNoticePeriodPolicyName() != null) {
                WorkflowConfigurationDTO.NoticePeriodDTO np = new WorkflowConfigurationDTO.NoticePeriodDTO();
                np.setPolicyName(entity.getNoticePeriodPolicyName());
                np.setEffectiveDate(entity.getNoticePeriodEffectiveDate());
                np.setNoticePeriodDuringProbation(entity.getNoticePeriodDuringProbation());
                np.setNoticePeriodAfterConfirmation(entity.getNoticePeriodAfterConfirmation());

                if (entity.getNoticePeriodMembers() != null && !entity.getNoticePeriodMembers().isEmpty()) {
                    List<WorkflowConfigurationDTO.MembersDTO> members = entity.getNoticePeriodMembers().stream().map(member -> {
                        WorkflowConfigurationDTO.MembersDTO memberDTO = new WorkflowConfigurationDTO.MembersDTO();
                        memberDTO.setType(member.getType());
                        memberDTO.setValues(Arrays.asList(member.getValues().split(",")));
                        return memberDTO;
                    }).collect(Collectors.toList());
                    np.setNoticePeriodMembers(members);
                }
                dto.setNoticePeriod(np);
            }

            // Department Clearance
            if (entity.getDepartmentName() != null) {
                WorkflowConfigurationDTO.DepartmentClearanceDTO dc = new WorkflowConfigurationDTO.DepartmentClearanceDTO();
                dc.setDepartmentName(entity.getDepartmentName());
                dc.setPoc(entity.getPoc());
                dc.setIsReportingClearance(entity.getIsReportingClearance());
                dc.setParentDepartment(entity.getParentDepartment());
                dc.setDepartmentTasks(entity.getDepartmentTasks());
                dto.setDepartmentClearance(dc);
            }

            // Probation Setup
            if (entity.getProbationPolicyName() != null) {
                WorkflowConfigurationDTO.ProbationSetupDTO ps = new WorkflowConfigurationDTO.ProbationSetupDTO();
                ps.setPolicyName(entity.getProbationPolicyName());
                ps.setEffectiveDate(entity.getProbationEffectiveDate());
                ps.setProbationDays(entity.getProbationDays());

                if (entity.getProbationMembers() != null && !entity.getProbationMembers().isEmpty()) {
                    List<WorkflowConfigurationDTO.MembersDTO> members = entity.getProbationMembers().stream().map(member -> {
                        WorkflowConfigurationDTO.MembersDTO memberDTO = new WorkflowConfigurationDTO.MembersDTO();
                        memberDTO.setType(member.getType());
                        memberDTO.setValues(Arrays.asList(member.getValues().split(",")));
                        return memberDTO;
                    }).collect(Collectors.toList());
                    ps.setProbationMembers(members);
                }
                dto.setProbationSetup(ps);
            }

            return dto;
        }).collect(Collectors.toList());
    }
}