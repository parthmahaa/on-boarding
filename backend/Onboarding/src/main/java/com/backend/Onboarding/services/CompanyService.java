package com.backend.Onboarding.services;

import com.backend.Onboarding.DTO.CompanyRegisterationDTO;
import com.backend.Onboarding.entities.*;
import com.backend.Onboarding.repo.*;
import com.backend.Onboarding.utilities.CompanyStatus;
import com.backend.Onboarding.utilities.PasswordGenerator;
import com.backend.Onboarding.entities.PendingRegistration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class CompanyService {

    private final CompanyRepo companyRepo;
    private final EmailService emailService;
    private final EmployeeRepo employeeRepo;
    private final RolesRepo rolesRepo;
    private final BCryptPasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final Map<String, PendingRegistration> pendingRegistrations = new HashMap<>();

    @Value("${app.onboarding.base-url}")
    private String baseUrl;

    public CompanyService(CompanyRepo companyRepo, EmailService emailService, EmployeeRepo employeeRepo, RolesRepo rolesRepo, BCryptPasswordEncoder passwordEncoder, OtpService otpService) {
        this.companyRepo = companyRepo;
        this.emailService = emailService;
        this.employeeRepo = employeeRepo;
        this.rolesRepo = rolesRepo;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
    }

    public String initiateRegistration(CompanyRegisterationDTO dto) {
        // Step 1: Perform all validations before proceeding

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

        // Step 2: Generate a token and OTP
        String token = UUID.randomUUID().toString();
        String otp = otpService.generateOtp();
        LocalDateTime expiry = otpService.calculateExpiry();

        // Step 3: Store the registration data temporarily
        PendingRegistration pending = new PendingRegistration();
        pending.setToken(token);
        pending.setRegistrationDTO(dto);
        pending.setOtp(otp);
        pending.setExpiry(expiry);
        pendingRegistrations.put(token, pending);

        // Step 4: Send OTP to the registering employee's email
        try {
            emailService.sendOtpAsync(dto.getEmail(), otp);
        } catch (Exception e) {
            System.err.println("Failed to send OTP to " + dto.getEmail() + ": " + e.getMessage());
            throw new RuntimeException("Failed to send OTP");
        }

        return token;
    }

    @Transactional
    public String completeRegistration(String token, String userPassword, String providedOtp) {
        // Step 1: Retrieve and validate the pending registration
        PendingRegistration pending = pendingRegistrations.get(token);
        if (pending == null) {
            throw new IllegalArgumentException("Invalid or expired registration token");
        }

        // Step 2: Verify the OTP
        if (!otpService.verifyOtp(providedOtp, pending.getOtp(), pending.getExpiry())) {
            throw new IllegalArgumentException("Invalid or expired OTP");
        }

        CompanyRegisterationDTO dto = pending.getRegistrationDTO();
        String designation = dto.getDesignation();
        final String effectiveDesignation = designation.equals("OTHER") ? dto.getCustomDesignation() : designation;

        // Step 3: Prepare the company entity
        CompanyEntity company = new CompanyEntity();
        company.setCompanyName(dto.getCompanyName());
        company.setGstRegisterationNumber(dto.getGstRegistrationNumber());
        company.setShortName(dto.getShortName());
        company.setPincode(dto.getPincode());
        company.setAddress(dto.getAddress());
        company.setNoOfEmployees(dto.getNumberOfEmployees());
        company.setStatus(CompanyStatus.CREATED);

        // Step 4: Prepare roles and employees
        // Registering employee's role
        Set<Roles> registeringEmployeeRoles = new HashSet<>();
        Roles designationRole = rolesRepo.findByRoleName(effectiveDesignation)
                .orElseGet(() -> {
                    Roles newRole = new Roles();
                    newRole.setRoleName(effectiveDesignation);
                    return rolesRepo.save(newRole);
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
        registeringEmployee.setPassword(passwordEncoder.encode(userPassword)); // Use user-provided password

        // Prepare additional employees if designation is "OTHER"
        Employees ownerEmployee = null;
        Employees hrEmployee = null;
        String ownerRawPassword = null;
        String hrRawPassword = null;
        if (designation.equals("OTHER")) {
            // Owner employee
            Set<Roles> ownerRoles = new HashSet<>();
            Roles ownerRole = rolesRepo.findByRoleName("OWNER")
                    .orElseGet(() -> {
                        Roles newRole = new Roles();
                        newRole.setRoleName("OWNER");
                        return rolesRepo.save(newRole);
                    });
            ownerRoles.add(ownerRole);
            ownerEmployee = new Employees();
            ownerEmployee.setCompany(company);
            ownerEmployee.setCompanyName(company.getCompanyName());
            ownerEmployee.setEmployeeFirstName(dto.getOwnerDetails().getFirstName());
            ownerEmployee.setEmployeeLastName(dto.getOwnerDetails().getLastName());
            ownerEmployee.setEmployeeEmail(dto.getOwnerDetails().getEmail());
            ownerEmployee.setEmployeePhone(dto.getOwnerDetails().getPhone());
            ownerEmployee.setRoles(ownerRoles);
            // Generate and hash the password for the owner
            ownerRawPassword = PasswordGenerator.generateRandomPassword(12);
            ownerEmployee.setPassword(passwordEncoder.encode(ownerRawPassword));

            // HR employee
            Set<Roles> hrRoles = new HashSet<>();
            Roles hrRole = rolesRepo.findByRoleName("HR")
                    .orElseGet(() -> {
                        Roles newRole = new Roles();
                        newRole.setRoleName("HR");
                        return rolesRepo.save(newRole);
                    });
            hrRoles.add(hrRole);
            hrEmployee = new Employees();
            hrEmployee.setCompany(company);
            hrEmployee.setCompanyName(company.getCompanyName());
            hrEmployee.setEmployeeFirstName(dto.getHrDetails().getFirstName());
            hrEmployee.setEmployeeLastName(dto.getHrDetails().getLastName());
            hrEmployee.setEmployeeEmail(dto.getHrDetails().getEmail());
            hrEmployee.setEmployeePhone(dto.getHrDetails().getPhone());
            hrEmployee.setRoles(hrRoles);
            // Generate and hash the password for HR
            hrRawPassword = PasswordGenerator.generateRandomPassword(12);
            hrEmployee.setPassword(passwordEncoder.encode(hrRawPassword));
        }

        // Step 5: Save all entities in the transaction
        Set<Roles> allRoles = new HashSet<>(registeringEmployeeRoles);
        if (ownerEmployee != null) allRoles.addAll(ownerEmployee.getRoles());
        if (hrEmployee != null) allRoles.addAll(hrEmployee.getRoles());
        for (Roles role : allRoles) {
            if (role.getId() == null) { // New role
                rolesRepo.save(role);
            }
        }

        company = companyRepo.save(company);
        employeeRepo.save(registeringEmployee);
        if (ownerEmployee != null) employeeRepo.save(ownerEmployee);
        if (hrEmployee != null) employeeRepo.save(hrEmployee);

        // Step 6: Send emails to owner and HR if designation is "OTHER"
        if (designation.equals("OTHER")) {
            try {
                emailService.sendCredentialsEmailAsync(
                        ownerEmployee.getEmployeeEmail(),
                        ownerEmployee.getEmployeeEmail(),
                        ownerRawPassword
                );
            } catch (Exception e) {
                System.err.println("Failed to send email to " + ownerEmployee.getEmployeeEmail() + ": " + e.getMessage());
            }

            try {
                emailService.sendCredentialsEmailAsync(
                        hrEmployee.getEmployeeEmail(),
                        hrEmployee.getEmployeeEmail(),
                        hrRawPassword
                );
            } catch (Exception e) {
                System.err.println("Failed to send email to " + hrEmployee.getEmployeeEmail() + ": " + e.getMessage());
            }
        }

        // Step 7: Remove the pending registration
        pendingRegistrations.remove(token);

        return "Registration completed successfully";
    }

    public PendingRegistration getPendingRegistration(String token) {
        return pendingRegistrations.get(token);
    }
}