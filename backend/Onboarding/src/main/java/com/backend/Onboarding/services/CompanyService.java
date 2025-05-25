package com.backend.Onboarding.services;

import com.backend.Onboarding.DTO.CompanyRegisterationDTO;
import com.backend.Onboarding.entities.*;
import com.backend.Onboarding.repo.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class CompanyService {

    private final CompanyRepo companyRepo;
    private final UrlRepo urlRepo;
    private final EmployeeRepo employeeRepo;
    private final RolesRepo rolesRepo;

    @Value("${app.onboarding.base-url}")
    private String baseUrl;

    public CompanyService(CompanyRepo companyRepo, EmployeeRepo employeeRepo,
                          RolesRepo rolesRepo, UrlRepo urlRepo) {
        this.companyRepo = companyRepo;
        this.urlRepo = urlRepo;
        this.employeeRepo = employeeRepo;
        this.rolesRepo = rolesRepo;
    }

    @Transactional
    public String registerCompany(CompanyRegisterationDTO dto) {
        // Step 1: Perform all validations before saving anything to the database

        // Validate company details
        if (companyRepo.existsByCompanyName(dto.getCompanyName())) {
            throw new IllegalArgumentException("Company name already exists");
        }
        if (employeeRepo.existsByEmployeeEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Validate designation
        String designation = dto.getDesignation();
        if (designation == null || designation.trim().isEmpty()) {
            throw new IllegalArgumentException("Designation cannot be empty");
        }
        if (!designation.equals("OWNER") && !designation.equals("HR") && !designation.equals("OTHER")) {
            throw new IllegalArgumentException("Designation must be 'OWNER', 'HR', 'OTHER'");
        }

        final String effectiveDesignation;
        if (designation.equals("OTHER")) {
            if (dto.getCustomDesignation() == null || dto.getCustomDesignation().trim().isEmpty()) {
                throw new IllegalArgumentException("User Designation is required");
            }
            if (dto.getOwnerDetails() == null) {
                throw new IllegalArgumentException("Owner details must be provided");
            }
            if (dto.getHrDetails() == null) {
                throw new IllegalArgumentException("HR details must be provided");
            }
            // Validate Owner details
            if (employeeRepo.existsByEmployeeEmail(dto.getOwnerDetails().getEmail())) {
                throw new IllegalArgumentException("Owner Email already exists");
            }
            if (!dto.getOwnerDetails().getPhone().matches("\\d{10}")) {
                throw new IllegalArgumentException("Owner phone must be exactly 10 digits");
            }
            // Validate HR details
            if (employeeRepo.existsByEmployeeEmail(dto.getHrDetails().getEmail())) {
                throw new IllegalArgumentException("HR email already exists");
            }
            if (!dto.getHrDetails().getPhone().matches("\\d{10}")) {
                throw new IllegalArgumentException("HR phone must be exactly 10 digits");
            }
            // Ensure Owner and HR emails are different from the registering employee
            if (dto.getOwnerDetails().getEmail().equals(dto.getEmail())) {
                throw new IllegalArgumentException("Owner email must be different from your email");
            }
            if (dto.getHrDetails().getEmail().equals(dto.getEmail())) {
                throw new IllegalArgumentException("HR email must be different from your email");
            }
            if (dto.getOwnerDetails().getEmail().equals(dto.getHrDetails().getEmail())) {
                throw new IllegalArgumentException("Owner and HR emails must be different");
            }
            effectiveDesignation = dto.getCustomDesignation();
        } else {
            effectiveDesignation = designation;
        }

        // Step 2: Prepare the company entity
        CompanyEntity company = new CompanyEntity();
        company.setCompanyName(dto.getCompanyName());
        company.setGstRegisterationNumber(dto.getGstRegistrationNumber());
        company.setShortName(dto.getShortName());
        company.setPincode(dto.getPincode());
        company.setAddress(dto.getAddress());
        company.setNoOfEmployees(dto.getNumberOfEmployees());

        // Step 3: Prepare roles and employees
        // Registering employee's role
        Set<Roles> registeringEmployeeRoles = new HashSet<>();
        Roles designationRole = rolesRepo.findByRoleName(effectiveDesignation)
                .orElseGet(() -> {
                    Roles newRole = new Roles();
                    newRole.setRoleName(effectiveDesignation);
                    return newRole;
                });
        registeringEmployeeRoles.add(designationRole);

        // Create the registering employee
        Employees registeringEmployee = new Employees();
        registeringEmployee.setCompany(company);
        registeringEmployee.setCompanyName(company.getCompanyName());
        registeringEmployee.setEmployeeFirstName(dto.getFirstName());
        registeringEmployee.setEmployeeLastName(dto.getLastName());
        registeringEmployee.setEmployeeEmail(dto.getEmail());
        registeringEmployee.setEmployeePhone(dto.getPhone());
        registeringEmployee.setRoles(registeringEmployeeRoles);

        // Prepare additional employees if designation is "Other"
        Employees ownerEmployee = null;
        Employees hrEmployee = null;

        // Save new roles first (if any)
        Set<Roles> allRoles = new HashSet<>(registeringEmployeeRoles);
        for (Roles role : allRoles) {
            if (role.getId() == null) { // New role
                rolesRepo.save(role);
            }
        }

        // Save company and employees
        company = companyRepo.save(company);
        employeeRepo.save(registeringEmployee);

        // Generate and save URL
        String urlToken = UUID.randomUUID().toString();
        String fullUrl = baseUrl + "/company-onboarding?token=" + urlToken;

        Urls url = new Urls();
        url.setCompany(company);
        url.setUrlToken(urlToken);
        urlRepo.save(url);

        return fullUrl;
    }

}