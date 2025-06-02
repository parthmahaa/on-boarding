package com.backend.Onboarding.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BranchDTO {

    @NotNull(message = "Branch name cannot be null")
    private String branchName;

    @NotBlank(message = "Pincode cannot be empty")
    @Size(min = 6, max = 6, message = "Pincode must be exactly 6 digits")
    @Pattern(regexp = "\\d{6}", message = "Pincode must contain 6 digits")
    private String pincode;

    @NotNull(message = "Country cannot be empty")
    private String country;

    @NotNull(message = "State cannot be empty")
    private String state;
    @NotNull(message = "City name cannot be empty")
    private String city;
    @NotNull(message = "Branch Address cannot be empty")
    private String branchAddress;

    private String timeZone;

    @NotNull(message = "Please fill payroll branch")
    private String isPayrollBranch;
}
