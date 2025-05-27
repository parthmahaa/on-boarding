package com.backend.Onboarding.services;

import ch.qos.logback.core.model.conditional.ElseModel;
import com.backend.Onboarding.DTO.CompanyAdminDTO;
import com.backend.Onboarding.DTO.EmployeeAdminDTO;
import com.backend.Onboarding.entities.CompanyEntity;
import com.backend.Onboarding.entities.Employees;
import com.backend.Onboarding.entities.Roles;
import com.backend.Onboarding.repo.CompanyRepo;
import com.backend.Onboarding.repo.EmployeeRepo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final CompanyRepo companyRepo;
    private final EmployeeRepo employeeRepo;

    public AdminService(CompanyRepo companyRepo, EmployeeRepo employeeRepo) {
        this.companyRepo = companyRepo;
        this.employeeRepo = employeeRepo;
    }

    public List<CompanyAdminDTO> getAllCompanies(boolean includeEmployees) {
        List<CompanyEntity> companies = companyRepo.findAll();
        System.out.println("Found " + companies.size() + " companies");
        return companies.stream().map(company -> {
            CompanyAdminDTO dto = new CompanyAdminDTO();
            dto.setId(company.getCompanyId());
            dto.setCompanyName(company.getCompanyName());
            dto.setGstRegistrationNumber(company.getGstRegisterationNumber());
            dto.setPincode(company.getPincode());
            dto.setAddress(company.getAddress());
            dto.setNoOfEmployees(company.getNoOfEmployees());
            dto.setCompanyStatus(company.getStatus());

            return dto;
        }).collect(Collectors.toList());
    }


    private EmployeeAdminDTO mapToEmployeeAdminDTO(Employees employee) {
        EmployeeAdminDTO dto = new EmployeeAdminDTO();
        dto.setId(employee.getId());
        dto.setFirstName(employee.getEmployeeFirstName());
        dto.setLastName(employee.getEmployeeLastName());
        dto.setEmail(employee.getEmployeeEmail());
        dto.setPhone(employee.getEmployeePhone());
        dto.setRoles(employee.getRoles().stream()
                .map(Roles::getRoleName)
                .collect(Collectors.toSet()));
        return dto;
    }

    public void deleteCompany(String id) {
        try {
            UUID companyId = UUID.fromString(id); // Convert string to UUID
            CompanyEntity company = companyRepo.findById(companyId)
                    .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + id));
            companyRepo.delete(company);
        } catch (IllegalArgumentException e) {
            if (e.getMessage().startsWith("Company not found")) {
                throw e; // Re-throw to handle in controller
            }
            throw new IllegalArgumentException("Invalid UUID format for ID: " + id);
        }
    }

    public List<EmployeeAdminDTO> getCompanyEmployees(String companyIdStr) {
        UUID companyId;
        try {
            companyId = UUID.fromString(companyIdStr);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid UUID format for company ID: " + companyIdStr);
        }

        CompanyEntity company = companyRepo.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found with ID: " + companyId));

        List<Employees> employees = company.getEmployees();
        if (employees == null || employees.isEmpty()) {
            return List.of();
           }

        return employees.stream()
                .map(this::mapToEmployeeAdminDTO)
                .collect(Collectors.toList());
    }
}
