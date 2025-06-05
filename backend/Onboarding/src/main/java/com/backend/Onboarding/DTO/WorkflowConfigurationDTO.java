package com.backend.Onboarding.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class WorkflowConfigurationDTO {

    private NoticePeriodDTO noticePeriod;
    private DepartmentClearanceDTO departmentClearance;
    private ProbationSetupDTO probationSetup;

    @Data
    public static class NoticePeriodDTO{

        @NotNull(message = "Notice period cannot be null")
        private String policyName;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MMM-yyyy")
        private LocalDate effectiveDate;

        @NotNull(message = "Notice period during probation cannot be null")
        private Integer noticePeriodDuringProbation;

        @NotNull(message = "Days after notice period confirmation cannot be null")
        private Integer noticePeriodAfterConfirmation;

        private List<MembersDTO> noticePeriodMembers;
    }

    @Data
    public static class DepartmentClearanceDTO{

        @NotNull(message = "Department name cannot be empty")
        private String departmentName;

        @NotNull(message = "POC cannot be empty")
        private String poc;

        private Boolean isReportingClearance;
        private String parentDepartment;

        @NotNull(message = "Department clearance tasks cannot be empty")
        private String departmentTasks;
    }

    @Data
    public static class ProbationSetupDTO{

        @NotNull(message = "Probation Policy name cannot be empty")
        private String PolicyName;

        @NotNull(message = "Probation effective date cannot be null")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MMM-yyyy")
        private LocalDate effectiveDate;

        @NotNull(message = "Probation days cannot be empty")
        private int probationDays;

        private List<MembersDTO> probationMembers;
    }

    @Data
    public static class MembersDTO {
        @NotNull(message = "Rule type cannot be null")
        private String type; // e.g., "branch", "employee", "sbu", etc.

        @NotNull(message = "Rule values cannot be empty")
        private List<String> values; // e.g., ["Branch A", "Branch B"]
    }
}
