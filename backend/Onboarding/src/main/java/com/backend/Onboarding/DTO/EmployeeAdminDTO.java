package com.backend.Onboarding.DTO;

import lombok.Data;

import java.util.Set;

@Data
public class EmployeeAdminDTO {

    // this is the DTO when admin will try to access the employee details of a company
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String branch;
    private String status;
    private Set<String> roles;
}