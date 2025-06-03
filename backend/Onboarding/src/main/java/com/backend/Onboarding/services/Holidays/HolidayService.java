package com.backend.Onboarding.services.Holidays;

import com.backend.Onboarding.DTO.Holidays.CriteriaDTO;
import com.backend.Onboarding.DTO.Holidays.HolidayAllocationDetailDTO;
import com.backend.Onboarding.DTO.Holidays.HolidayDetailsDTO;
import com.backend.Onboarding.entities.CompanyEntity;
import com.backend.Onboarding.entities.Employees;
import com.backend.Onboarding.entities.Holidays.HolidayAllocationDetails;
import com.backend.Onboarding.entities.Holidays.HolidayDetails;
import com.backend.Onboarding.entities.Holidays.HolidayEmployeeMapping;
import com.backend.Onboarding.repo.CompanyRepo;
import com.backend.Onboarding.repo.EmployeeRepo;
import com.backend.Onboarding.repo.Holidays.HolidayAllocationDetailsRepo;
import com.backend.Onboarding.repo.Holidays.HolidayDetailsRepo;
import com.backend.Onboarding.repo.Holidays.HolidayEmployeeMappingRepo;
import com.backend.Onboarding.utilities.HolidayConstants;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class HolidayService {

    @Autowired
    private HolidayDetailsRepo holidayDetailsRepo;

    @Autowired
    private HolidayAllocationDetailsRepo holidayAllocationDetailsRepo;

    @Autowired
    private HolidayEmployeeMappingRepo holidayEmployeeMappingRepo;

    @Autowired
    private EmployeeRepo employeeRepo;

    @Autowired
    private CompanyRepo companyRepo;

    public HolidayDetailsDTO addHoliday(HolidayDetailsDTO dto) {
        HolidayDetails holidayDetails = mapToHolidayDetails(dto);
        try{
            HolidayDetails savedHoliday = holidayDetailsRepo.save(holidayDetails);
            return mapToHolidayDetailsDTO(savedHoliday);
        }catch (Exception e){
            throw new RuntimeException("Failed to add Holiday:" +e.getMessage());
        }
    }

    // Assign holiday to employees based on filters
    public String assignHolidayToEmployees(HolidayAllocationDetailDTO assignmentDTO) {
        try {
            Long holidayId = assignmentDTO.getHolidayId();
            List<String> employeeIds = assignmentDTO.getEmployeeIds();
            List<Employees> employees = new ArrayList<>();

            // Handle criteria-based assignment
            if (assignmentDTO.getCriteria() != null && !assignmentDTO.getCriteria().isEmpty()) {
                for (CriteriaDTO criterion : assignmentDTO.getCriteria()) {
                    String field = criterion.getField();
                    List<String> values = criterion.getValue();
                    if (values != null) {
                        for (String value : values) {
                            switch (field) {
                                case "branch":
                                    employees.addAll(employeeRepo.findByBranch(value));
                                    break;
                                case "designation":
                                    employees.addAll(employeeRepo.findByDesignation(value));
                                    break;
                                case "department":
                                    employees.addAll(employeeRepo.findByDepartment(value));
                                    break;
                                case "grade":
                                    employees.addAll(employeeRepo.findByGrade(value));
                                    break;
                            }
                        }
                    }
                }
            }

            // Handle direct employee assignment
            if (employeeIds != null && !employeeIds.isEmpty()) {
                employees.addAll(employeeRepo.findAllById(employeeIds));
            }

            // Remove duplicates
            Set<String> uniqueEmployeeIds = new HashSet<>();
            List<Employees> uniqueEmployees = new ArrayList<>();
            for (Employees emp : employees) {
                if (uniqueEmployeeIds.add(emp.getId())) {
                    uniqueEmployees.add(emp);
                }
            }

//            if (uniqueEmployees.isEmpty()) {
//                throw new RuntimeException("No employees found for holiday allocation");
//            }

            // Serialize criteria to JSON for storage
            String criteriaJson = "";
            if (assignmentDTO.getCriteria() != null && !assignmentDTO.getCriteria().isEmpty()) {
                ObjectMapper objectMapper = new ObjectMapper();
                criteriaJson = objectMapper.writeValueAsString(assignmentDTO.getCriteria());
            }

            // Create a holiday allocation record
            HolidayAllocationDetails allocation = new HolidayAllocationDetails();
            allocation.setHolidayId(holidayId);
            allocation.setStatus(assignmentDTO.getStatus() != null ? assignmentDTO.getStatus() : "ACTIVE");
            allocation.setYear(assignmentDTO.getYear());
            allocation.setCriteriaValue(criteriaJson);
            allocation = holidayAllocationDetailsRepo.save(allocation);

            // Map each employee to the holiday
            for (Employees emp : uniqueEmployees) {
                HolidayEmployeeMapping mapping = new HolidayEmployeeMapping(holidayId, allocation.getId(), emp.getId());
                holidayEmployeeMappingRepo.save(mapping);
            }
            return "Holidays Allocated";
        } catch (Exception e) {
            throw new RuntimeException("Failed to allocate: " + e.getMessage());
        }
    }

    public List<HolidayDetails> listHolidaysByCompany(String companyId) {
        return holidayDetailsRepo.findByCompany_CompanyId(UUID.fromString(companyId));
    }


    public HolidayDetails mapToHolidayDetails(HolidayDetailsDTO dto){
        HolidayDetails holiday = new HolidayDetails();

        if(dto.getCompanyId() != null) {
            UUID companyUUID = UUID.fromString(dto.getCompanyId());
            CompanyEntity company = companyRepo.findById(companyUUID)
                    .orElseThrow(() -> new RuntimeException("Company not found"));
            holiday.setCompany(company);
        }

        holiday.setHolidayName(dto.getHolidayName());
        holiday.setHolidayDate(dto.getHolidayDate());
        holiday.setIsOptionalHoliday(dto.getIsOptionalHoliday());
        holiday.setIsRecurringHoliday(dto.getIsRecurringHoliday());
        holiday.setIsHolidayPayApplicable(dto.getIsHolidayPayApplicable());
        StringBuilder typeBuilder = new StringBuilder();
        if (Boolean.TRUE.equals(dto.getIsOptionalHoliday())) {
            typeBuilder.append("OPTIONAL");
        } else {
            typeBuilder.append("FIXED");
        }
        if (Boolean.TRUE.equals(dto.getIsHolidayPayApplicable())) {
            typeBuilder.append(",PAID");
        }
        if (Boolean.TRUE.equals(dto.getIsRecurringHoliday())) {
            typeBuilder.append(",RECURRING");
        }
        holiday.setHolidayType(typeBuilder.toString());

        if(dto.getStatus() == null){
            holiday.setStatus(HolidayConstants.status.ACTIVE);
        }else {
            holiday.setStatus(HolidayConstants.status.INACTIVE);
        }

        return holiday;
    }

    public HolidayDetailsDTO mapToHolidayDetailsDTO(HolidayDetails holiday){
        HolidayDetailsDTO dto = new HolidayDetailsDTO();
        dto.setId(holiday.getId());
        dto.setCompanyId(holiday.getCompany().getCompanyId().toString());
        dto.setHolidayName(holiday.getHolidayName());
        dto.setHolidayDate(holiday.getHolidayDate());
        dto.setHolidayType(holiday.getHolidayType());
        dto.setIsHolidayPayApplicable(holiday.getIsHolidayPayApplicable());
        dto.setIsOptionalHoliday(holiday.getIsOptionalHoliday());
        dto.setIsRecurringHoliday(holiday.getIsRecurringHoliday());
        dto.setStatus(holiday.getStatus().toString());

        return dto;
    }
}
