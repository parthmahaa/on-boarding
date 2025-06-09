package com.backend.Onboarding.services;

import com.backend.Onboarding.DTO.AddEmployeeDTO;
import com.backend.Onboarding.DTO.ListEmployeesDTO;
import com.backend.Onboarding.entities.CompanyEntity;
import com.backend.Onboarding.entities.Employees;
import com.backend.Onboarding.entities.Manager;
import com.backend.Onboarding.entities.Roles;
import com.backend.Onboarding.repo.CompanyRepo;
import com.backend.Onboarding.repo.EmployeeRepo;
import com.backend.Onboarding.repo.ManagerRepo;
import com.backend.Onboarding.repo.RolesRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepo employeeRepo;
    private final CompanyRepo companyRepo;
    private final ManagerRepo managerRepo;
    private final RolesRepo rolesRepo;

    public EmployeeService(EmployeeRepo employeeRepo, CompanyRepo companyRepo, ManagerRepo managerRepo, RolesRepo rolesRepo) {
        this.employeeRepo = employeeRepo;
        this.companyRepo = companyRepo;
        this.managerRepo = managerRepo;
        this.rolesRepo = rolesRepo;
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
        employee.setBranch(dto.getBranch());
        employee.setDesignation(dto.getDesignation());
        employee.setGrade(dto.getGrade());
        employee.setEmployeeType(dto.getEmployeeType());
        employee.setEmploymentType(dto.getEmploymentType());
        employee.setProbationStatus(dto.getProbationStatus());
        employee.setEmployeeEmail(dto.getOfficialEmail());
        employee.setSubDepartment(dto.getSubDepartment());
        employee.setCountOffDayInAttendance(dto.getCountOffDayInAttendance());
        employee.setCountHolidayInAttendance(dto.getCountHolidayInAttendance());
        employee.setDepartment(dto.getDepartment());
        employee.setPrimaryManager(validateAndGetManager(dto.getPrimaryManagerId()));
        employee.setSecondaryManager(validateAndGetManager(dto.getSecondaryManagerId()));

        employee.setPaymentMethod(dto.getPaymentMethod());
        employee.setAadharNo(dto.getAadharNo());
        employee.setPanNo(dto.getPanNo());

        // Set existing fields
        // Save the employee

        return employeeRepo.save(employee);
    }

    private Manager validateAndGetManager(String managerId) {
        if (managerId == null || managerId.isEmpty()) {
            return null;
        }

        // Check if a Manager entity already exists for this ID
        Optional<Manager> existingManager = managerRepo.findById(managerId);
        if (existingManager.isPresent()) {
            return existingManager.get();
        }

        // Check if the employee with this ID exists
        Optional<Employees> managerEmployeeOpt = employeeRepo.findById(managerId);
        if (managerEmployeeOpt.isEmpty()) {
            throw new IllegalArgumentException("Employee with ID " + managerId + " not found to assign as manager");
        }

        Employees managerEmployee = managerEmployeeOpt.get();

        // Ensure the employee has the MANAGER role
        Roles managerRole = rolesRepo.findByRoleName("MANAGER")
                .orElseGet(() -> {
                    Roles newRole = new Roles();
                    newRole.setRoleName("MANAGER");
                    return rolesRepo.save(newRole);
                });
        Set<Roles> employeeRoles = managerEmployee.getRoles();
        if (employeeRoles == null) {
            employeeRoles = new HashSet<>();
            managerEmployee.setRoles(employeeRoles);
        }
        if (employeeRoles.stream().noneMatch(role -> "MANAGER".equals(role.getRoleName()))) {
            employeeRoles.add(managerRole);
            employeeRepo.save(managerEmployee); // Update the employee with the new role
        }

        // Create a new Manager entity
        Manager newManager = new Manager();
        newManager.setId(managerId);
        newManager.setFirstName(managerEmployee.getEmployeeFirstName());
        newManager.setLastName(managerEmployee.getEmployeeLastName());
        newManager.setCompany(managerEmployee.getCompany());
        return managerRepo.save(newManager);
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

    public List<ListEmployeesDTO> getEmpDetails(UUID id) {

        CompanyEntity company = companyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with ID: " + id));



        List<Employees> employees = company.getEmployees();

        if(employees == null || employees.isEmpty()){
            return List.of();
        }

        return employees.stream()
                .map(this::mapToListEmpDTO)
                .collect(Collectors.toList());
    }

    // In EmployeeService.java

    public List<String> getUniqueEmployeeNamesByCompanyId(UUID companyId) {
        CompanyEntity company = companyRepo.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + companyId));
        return company.getEmployees().stream()
                .map(e -> e.getId() + " - "+ e.getEmployeeFirstName() + " " + e.getEmployeeLastName())
                .distinct()
                .collect(Collectors.toList());
    }

    public List<String> getUniqueDepartmentsByCompanyId(UUID companyId) {
        CompanyEntity company = companyRepo.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + companyId));
        return company.getEmployees().stream()
                .map(Employees::getDepartment)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<String> getUniqueDesignationsByCompanyId(UUID companyId) {
        CompanyEntity company = companyRepo.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + companyId));
        return company.getEmployees().stream()
                .map(Employees::getDesignation)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<String> getUniqueEmployeeTypesByCompanyId(UUID companyId) {
        CompanyEntity company = companyRepo.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + companyId));
        return company.getEmployees().stream()
                .map(Employees::getEmployeeType)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<String> getUniqueEmploymentTypesByCompanyId(UUID companyId) {
        CompanyEntity company = companyRepo.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + companyId));
        return company.getEmployees().stream()
                .map(Employees::getEmploymentType)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<String> getUniqueGradesByCompanyId(UUID companyId) {
        CompanyEntity company = companyRepo.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + companyId));
        return company.getEmployees().stream()
                .map(Employees::getGrade)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<String> getUniqueRolesByCompanyId(UUID companyId) {
        CompanyEntity company = companyRepo.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + companyId));
        return company.getEmployees().stream()
                .map(Employees::getRole)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
    }

    private ListEmployeesDTO mapToListEmpDTO(Employees employee) {
        // Get manager details
        Manager primaryManager = employee.getPrimaryManager();
        Manager secondaryManager = employee.getSecondaryManager();

        ListEmployeesDTO dto = new ListEmployeesDTO();
        dto.setEmployeeId(employee.getId());
        dto.setFullName(employee.getEmployeeFirstName() + " " + employee.getEmployeeLastName());
        dto.setJoiningDate(employee.getDateOfJoining());
        dto.setCreatedAt(employee.getCreatedAt());
        dto.setEmail(employee.getEmployeeEmail());
        dto.setSBU(employee.getSbu());
        dto.setBranch(employee.getBranch());
        dto.setDepartment(employee.getDepartment());
        dto.setSubDepartment(employee.getSubDepartment());
        dto.setDesignation(employee.getDesignation());
        dto.setGrade(employee.getGrade());

        if (primaryManager == null) {
            dto.setPrimaryManager(null);
        } else {
            dto.setPrimaryManager(primaryManager.getFirstName() + " " + primaryManager.getLastName());
        }
        if (secondaryManager == null) {
            dto.setSecondaryManager(null);
        } else {
            dto.setSecondaryManager(secondaryManager.getFirstName() + " " + secondaryManager.getLastName());
        }

        dto.setStatus(employee.getStatus());

        return  dto;
    }
}