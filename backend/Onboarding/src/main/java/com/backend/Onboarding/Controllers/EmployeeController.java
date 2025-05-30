package com.backend.Onboarding.Controllers;

import com.backend.Onboarding.Config.ResponseWrapper;
import com.backend.Onboarding.DTO.AddEmployeeDTO;
import com.backend.Onboarding.DTO.ListEmployeesDTO;
import com.backend.Onboarding.entities.Employees;
import com.backend.Onboarding.services.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping("/addEmployee")
    public ResponseEntity<ResponseWrapper<Employees>> addEmployee(@Valid @RequestBody AddEmployeeDTO dto) {
        try {
            Employees employee = employeeService.addEmployee(dto);
            ResponseWrapper<Employees> response = new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.OK.value(),
                    "Employee added Successfully",
                    employee,
                    false
            );
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("Company not found")) {
                return new ResponseEntity<>(new ResponseWrapper<>(
                        LocalDateTime.now(),
                        HttpStatus.NOT_FOUND.value(),
                        "Company Not Found",
                        null,
                        true
                ), HttpStatus.NOT_FOUND);
            }
            if (e.getMessage().contains("Invalid UUID")) {
                return new ResponseEntity<>(new ResponseWrapper<>(
                        LocalDateTime.now(),
                        HttpStatus.BAD_REQUEST.value(),
                        "Invalid ID or format",
                        null,
                        true
                ), HttpStatus.BAD_REQUEST);
            }
            if (e.getMessage().contains("already exists")) {
                return new ResponseEntity<>(new ResponseWrapper<>(
                        LocalDateTime.now(),
                        HttpStatus.CONFLICT.value(),
                        "Already Exists:" + e.getMessage(),
                        null,
                        true
                ), HttpStatus.CONFLICT);
            }
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.BAD_REQUEST.value(),
                    "Error:" +e.getMessage(),
                    null,
                    true
            ), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "An error occurred while adding employee" + e.getMessage(),
                    null,
                    true
            ), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/getEmployeeList/{id}")
    public ResponseEntity<ResponseWrapper<List<ListEmployeesDTO>>> getEmpDetails(@PathVariable String id){
        UUID companyId;
        try {
             companyId = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid UUID format for company ID: " + id);
        }

        try{
            List<ListEmployeesDTO> employees = employeeService.getEmpDetails(companyId);

            if(employees == null){
                throw new RuntimeException("No Employees found");
            }

            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.OK.value(),
                    "Employees fetched",
                    employees,
                    false
            ), HttpStatus.OK);
        }catch (RuntimeException e){
            if(e.getMessage().equals("Company not found")){
                return new ResponseEntity<>(new ResponseWrapper<>(
                        LocalDateTime.now(),
                        HttpStatus.NOT_FOUND.value(),
                        "Company Not Found",
                        null,
                        true
                ), HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.NOT_FOUND.value(),
                    "An error Occured",
                    null,
                    true
            ),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}