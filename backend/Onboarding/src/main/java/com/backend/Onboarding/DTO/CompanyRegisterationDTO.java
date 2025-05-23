package com.backend.Onboarding.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Value;
import org.hibernate.validator.constraints.UniqueElements;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Data
public class CompanyRegisterationDTO {

    @NotBlank(message = "Company name is required")
    private String companyName;

    @Size(min = 15, max = 15, message = "GST registration number must be up to 15 characters")
    private String gstRegistrationNumber;

    @Size(max = 50, message = "Short name must be up to 50 characters")
    private String shortName;

    @NotBlank(message = "Pincode is mandatory")
    @Size(min = 6, max = 6, message = "Pincode must be exactly 6 digits")
    @Pattern(regexp = "\\d{6}", message = "Pincode must contain 6 digits")
    private String pincode;

    @NotBlank(message = "Please fill address")
    @Size(max = 255, message = "Address must be up to 255 characters")
    private String address;

    @Min(value = 1, message = "Number of employees must be at least 1")
    private Double numberOfEmployees;

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must be up to 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must be up to 50 characters")
    private String lastName;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Invalid email")
    private String email;

    @NotBlank(message = "Phone is mandatory")
    @Pattern(regexp = "\\d{10}", message = "Phone must be 10 digits")
    private String phone;

    @NotBlank(message = "Designation is required")
    private String designation;

    private String customDesignation; // Only required if designation is "Other"

    private EmployeeDetailsDTO ownerDetails; // Only required if designation is "Other"

    private EmployeeDetailsDTO hrDetails; // Only required if designation is "Other"

    // Nested DTO for Owner and HR details
    @Data
    public static class EmployeeDetailsDTO {
        @NotBlank(message = "First name cannot be empty")
        private String firstName;

        @NotBlank(message = "Last name cannot be empty")
        private String lastName;

        @NotBlank(message = "Email cannot be empty")
        @Email(message = "Email must be valid")
        private String email;

        @NotBlank(message = "Phone cannot be empty")
        @Pattern(regexp = "\\d{10}", message = "Phone must be exactly 10 digits")
        private String phone;
    }
}
