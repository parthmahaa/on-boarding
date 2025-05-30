package com.backend.Onboarding.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ListEmployeesDTO {

    private String fullName;
    private String employeeId;
    private LocalDate joiningDate;
    private LocalDate createdAt;
    private String email;
    private String SBU;
    private String branch;
    private String department;
    private String subDepartment;
    private String designation;
    private String grade;
    private String primaryManager;
    private String secondaryManager;
    private String status;
}
