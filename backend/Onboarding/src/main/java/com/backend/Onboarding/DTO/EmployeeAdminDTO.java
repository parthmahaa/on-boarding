package com.backend.Onboarding.DTO;

import lombok.Data;

import java.util.Set;

@Data
public class EmployeeAdminDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Set<String> roles;
}