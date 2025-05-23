package com.backend.Onboarding.services;

import com.backend.Onboarding.DTO.CompanyRegisterationDTO;
import com.backend.Onboarding.DTO.UrlDTO;
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
            throw new IllegalArgumentException("Company name already exists: " + dto.getCompanyName());
        }
        if (dto.getPincode() == null || !dto.getPincode().matches("\\d{6}")) {
            throw new IllegalArgumentException("Pincode must be exactly 6 digits");
        }
        if (employeeRepo.existsByEmployeeEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + dto.getEmail());
        }

        // Validate baseUrl
        if (baseUrl == null || baseUrl.trim().isEmpty()) {
            throw new IllegalStateException("Base URL is not configured properly");
        }

        // Validate designation
        String designation = dto.getDesignation();
        if (designation == null || designation.trim().isEmpty()) {
            throw new IllegalArgumentException("Designation cannot be empty");
        }
        if (!designation.equals("Owner") && !designation.equals("HR") &&
                !designation.equals("Admin") && !designation.equals("Other")) {
            throw new IllegalArgumentException("Designation must be 'Owner', 'HR', 'Admin', or 'Other'");
        }
        designation = switch (designation) {
            case "owner" -> "OWNER";
            case "Owner" -> "OWNER";
            case "Hr" -> "HR";
            case "hr" -> "HR";
            case "admin" -> "ADMIN";
            case "Admin" -> "ADMIN";
            case "other" -> "Other";
            case "Other" -> "Other";
            default -> designation;
        };

        final String effectiveDesignation;
        if (designation.equals("Other")) {
            if (dto.getCustomDesignation() == null || dto.getCustomDesignation().trim().isEmpty()) {
                throw new IllegalArgumentException("Custom designation must be provided when designation is 'Other'");
            }
            if (dto.getOwnerDetails() == null) {
                throw new IllegalArgumentException("Owner details must be provided when designation is 'Other'");
            }
            if (dto.getHrDetails() == null) {
                throw new IllegalArgumentException("HR details must be provided when designation is 'Other'");
            }
            // Validate Owner details
            if (employeeRepo.existsByEmployeeEmail(dto.getOwnerDetails().getEmail())) {
                throw new IllegalArgumentException("Owner email already exists: " + dto.getOwnerDetails().getEmail());
            }
            if (!dto.getOwnerDetails().getPhone().matches("\\d{10}")) {
                throw new IllegalArgumentException("Owner phone must be exactly 10 digits");
            }
            // Validate HR details
            if (employeeRepo.existsByEmployeeEmail(dto.getHrDetails().getEmail())) {
                throw new IllegalArgumentException("HR email already exists: " + dto.getHrDetails().getEmail());
            }
            if (!dto.getHrDetails().getPhone().matches("\\d{10}")) {
                throw new IllegalArgumentException("HR phone must be exactly 10 digits");
            }
            // Ensure Owner and HR emails are different from the registering employee
            if (dto.getOwnerDetails().getEmail().equals(dto.getEmail())) {
                throw new IllegalArgumentException("Owner email must be different from the registering employee's email");
            }
            if (dto.getHrDetails().getEmail().equals(dto.getEmail())) {
                throw new IllegalArgumentException("HR email must be different from the registering employee's email");
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
        registeringEmployee.setEmployeeFirstName(dto.getFirstName());
        registeringEmployee.setEmployeeLastName(dto.getLastName());
        registeringEmployee.setEmployeeEmail(dto.getEmail());
        registeringEmployee.setEmployeePhone(dto.getPhone());
        registeringEmployee.setRoles(registeringEmployeeRoles);

        // Prepare additional employees if designation is "Other"
        Employees ownerEmployee = null;
        Employees hrEmployee = null;
        if (designation.equals("Other")) {

            // Owner employee
            Set<Roles> ownerRoles = new HashSet<>();
            Roles ownerRole = rolesRepo.findByRoleName("OWNER")
                    .orElseThrow(() -> new IllegalArgumentException("Owner role not found in database"));
            ownerRoles.add(ownerRole);
            ownerEmployee = new Employees();
            ownerEmployee.setCompany(company);
            ownerEmployee.setEmployeeFirstName(dto.getOwnerDetails().getFirstName());
            ownerEmployee.setEmployeeLastName(dto.getOwnerDetails().getLastName());
            ownerEmployee.setEmployeeEmail(dto.getOwnerDetails().getEmail());
            ownerEmployee.setEmployeePhone(dto.getOwnerDetails().getPhone());
            ownerEmployee.setRoles(ownerRoles);

            // HR employee
            Set<Roles> hrRoles = new HashSet<>();
            Roles hrRole = rolesRepo.findByRoleName("HR")
                    .orElseThrow(() -> new IllegalArgumentException("HR role not found in database"));
            hrRoles.add(hrRole);
            hrEmployee = new Employees();
            hrEmployee.setCompany(company);
            hrEmployee.setEmployeeFirstName(dto.getHrDetails().getFirstName());
            hrEmployee.setEmployeeLastName(dto.getHrDetails().getLastName());
            hrEmployee.setEmployeeEmail(dto.getHrDetails().getEmail());
            hrEmployee.setEmployeePhone(dto.getHrDetails().getPhone());
            hrEmployee.setRoles(hrRoles);
        }

        // Step 4: Save all entities in the transaction
        // Save new roles first (if any)
        Set<Roles> allRoles = new HashSet<>();
        allRoles.addAll(registeringEmployeeRoles);
        if (ownerEmployee != null) allRoles.addAll(ownerEmployee.getRoles());
        if (hrEmployee != null) allRoles.addAll(hrEmployee.getRoles());
        for (Roles role : allRoles) {
            if (role.getId() == null) { // New role
                rolesRepo.save(role);
            }
        }

        // Save company and employees
        company = companyRepo.save(company);
        employeeRepo.save(registeringEmployee);
        if (ownerEmployee != null) employeeRepo.save(ownerEmployee);
        if (hrEmployee != null) employeeRepo.save(hrEmployee);

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