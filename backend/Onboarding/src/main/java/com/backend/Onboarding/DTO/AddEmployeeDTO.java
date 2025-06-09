package com.backend.Onboarding.DTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.Set;

@Data
public class AddEmployeeDTO {

    @NotBlank(message = "SBU is mandatory")
    @Size(min = 2, max = 50, message = "SBU must be between 2 and 50 characters")
    private String sbu;

    // Optional ID field
    private String id;

    // Mandatory Fields
    @NotBlank(message = "First name is mandatory")
    @Size(max = 50, message = "First name must be less than 50 characters")
    private String firstName;

    private String middleName;

    @NotBlank(message = "Last name is mandatory")
    @Size(max = 50, message = "Last name must be less than 50 characters")
    private String lastName;

    @NotBlank(message = "Gender is mandatory")
//    @Pattern(regexp = "MALE|FEMALE|OTHER", message = "Gender must be MALE, FEMALE, or OTHER")
    private String gender;

    @NotNull(message = "Date of Joining (DOJ) is mandatory")
    @Pattern(regexp = "\\d{2}-[A-Za-z]{3}-\\d{4}", message = "DOJ must be in DD-MMM-YYYY format")
    private String dateOfJoining;

    @NotNull(message = "Date of Birth (DOB) is mandatory")
    @Pattern(regexp = "\\d{2}-[A-Za-z]{3}-\\d{4}", message = "DOB must be in DD-MMM-YYYY format")
    private String dateOfBirth;

    @Pattern(regexp = "\\d{2}-[A-Za-z]{3}-\\d{4}", message = "Actual DOB must be in DD-MMM-YYYY format")
    private String actualDateOfBirth;

//    @Pattern(regexp = "\\d{12}", message = "Aadhar No must be 12 digits")
    private String aadharNo;

//    @Pattern(regexp = "[A-Z]{5}[0-9]{4}[A-Z]{1}", message = "PAN No must be in the format XXXXX9999X")
    private String panNo;

    @NotNull(message = "Email is required")
    @Email(message = "Official email must be a valid email address")
    private String officialEmail;

    @NotBlank(message = "Branch is mandatory")
    @Size(max = 100, message = "Branch must be less than 100 characters")
    private String branch;


    @NotBlank(message = "Designation is mandatory")
    @Size(max = 100, message = "Designation must be less than 100 characters")
    private String designation;

//    @NotBlank(message = "Grade is mandatory")
    @Size(max = 20, message = "Grade must be less than 20 characters")
    private String grade;

    @NotBlank(message = "Employee Type is mandatory")
    @Size(max = 50, message = "Employee Type must be less than 50 characters")
    private String employeeType;

    @NotBlank(message = "Employment Type is mandatory")
    @Size(max = 50, message = "Employment Type must be less than 50 characters")
    private String employmentType;

    @NotBlank(message = "Probation Status is mandatory")
    @Pattern(regexp = "ON_PROBATION|COMPLETED|EXTENDED", message = "Probation Status must be ON_PROBATION, COMPLETED, or EXTENDED")
    private String probationStatus;


    @NotNull(message = "Department is required")
    private String department;

    private String subDepartment;

    @Pattern(regexp = "\\d{2}-[A-Za-z]{3}-\\d{4}", message = "Probation End Date must be in DD-MMM-YYYY format")
    private String probationEndDate;

    @Pattern(regexp = "\\d{2}-[A-Za-z]{3}-\\d{4}", message = "Appraisal Date must be in DD-MMM-YYYY format")
    private String appraisalDate;

    private Boolean countOffDayInAttendance;

    private Boolean countHolidayInAttendance;

    private String primaryManagerId;

    private String secondaryManagerId;

    private String paymentMethod;

    private Set<String> roles;

    @NotBlank(message = "Company ID is mandatory")
    private String companyId;
}