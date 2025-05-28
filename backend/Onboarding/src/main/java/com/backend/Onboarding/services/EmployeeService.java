package com.backend.Onboarding.services;

import com.backend.Onboarding.DTO.AddEmployeeDTO;
import com.backend.Onboarding.entities.CompanyEntity;
import com.backend.Onboarding.entities.Employees;
import com.backend.Onboarding.entities.Roles;
import com.backend.Onboarding.repo.CompanyRepo;
import com.backend.Onboarding.repo.EmployeeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class EmployeeService {

    private final EmployeeRepo employeeRepo;
    private final CompanyRepo companyRepo;

    @Autowired
    public EmployeeService(EmployeeRepo employeeRepo, CompanyRepo companyRepo) {
        this.employeeRepo = employeeRepo;
        this.companyRepo = companyRepo;
    }

    @Transactional
    public Employees addEmployee(AddEmployeeDTO dto) {
        // Validate and fetch company
        UUID companyId;
        try {
            companyId = UUID.fromString(dto.getCompanyId());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid UUID format for company ID: " + dto.getCompanyId());
        }
        CompanyEntity company = companyRepo.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + dto.getCompanyId()));

        // Check if ID is provided and unique
        String employeeId = dto.getId();
        if (employeeId != null && !employeeId.isEmpty()) {
            if (employeeRepo.existsById(employeeId)) {
                throw new IllegalArgumentException("Employee ID " + employeeId + " already exists");
            }
        } else {
            // If no ID is provided, set a temporary placeholder (can be updated later)
            employeeId = "TEMP_" + UUID.randomUUID().toString().substring(0, 8);
        }

        // Create new employee entity
        Employees employee = new Employees();
        employee.setId(employeeId);
        employee.setCompany(company);
        employee.setCompanyName(company.getCompanyName());
        employee.setEmployeeFirstName(dto.getFirstName());
        employee.setEmployeeMiddleName(dto.getMiddleName());
        employee.setEmployeeLastName(dto.getLastName());

        // Parse dates
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy");
        employee.setDateOfJoining(LocalDate.parse(dto.getDateOfJoining(), formatter));
        employee.setDateOfBirth(LocalDate.parse(dto.getDateOfBirth(), formatter));
        if (dto.getActualDateOfBirth() != null) {
            employee.setActualDateOfBirth(LocalDate.parse(dto.getActualDateOfBirth(), formatter));
        }
        if (dto.getProbationEndDate() != null) {
            employee.setProbationEndDate(LocalDate.parse(dto.getProbationEndDate(), formatter));
        }
        if (dto.getAppraisalDate() != null) {
            employee.setAppraisalDate(LocalDate.parse(dto.getAppraisalDate(), formatter));
        }

        employee.setGender(dto.getGender());
        employee.setSbu(dto.getSbu());
        employee.setSalaryOn(dto.getSalaryOn());
        employee.setBranch(dto.getBranch());
        employee.setComplianceBranch(dto.getComplianceBranch());
        employee.setDesignation(dto.getDesignation());
        employee.setGrade(dto.getGrade());
        employee.setEmployeeType(dto.getEmployeeType());
        employee.setEmploymentType(dto.getEmploymentType());
        employee.setProbationStatus(dto.getProbationStatus());
        employee.setEmployeeEmail(dto.getOfficialEmail());
        employee.setSubDepartment(dto.getSubDepartment());
        employee.setCountOffDayInAttendance(dto.getCountOffDayInAttendance());
        employee.setCountHolidayInAttendance(dto.getCountHolidayInAttendance());
        employee.setPrimaryManagerId(dto.getPrimaryManagerId());
        employee.setSecondaryManagerId(dto.getSecondaryManagerId());
        employee.setPaymentMethod(dto.getPaymentMethod());
        employee.setAadharNo(dto.getAadharNo());
        employee.setPanNo(dto.getPanNo());

        // Set existing fields
        // Save the employee
        Employees savedEmployee = employeeRepo.save(employee);

        return savedEmployee;
    }

    @Transactional
    public Employees updateEmployeeId(String oldId, String newId) {
        // Validate new ID
        if (!newId.matches("^[A-Za-z0-9]{1,10}$")) {
            throw new IllegalArgumentException("New employee ID must be alphanumeric and up to 10 characters");
        }
        if (employeeRepo.existsById(newId)) {
            throw new IllegalArgumentException("New employee ID " + newId + " already exists");
        }

        // Fetch existing employee
        Employees employee = employeeRepo.findById(oldId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + oldId));

        // Update the ID
        employee.setId(newId);
        return employeeRepo.save(employee);
    }
}