package com.backend.Onboarding.Controllers;

import com.backend.Onboarding.Config.ResponseWrapper;
import com.backend.Onboarding.DTO.AddEmployeeDTO;
import com.backend.Onboarding.entities.Employees;
import com.backend.Onboarding.services.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

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
                        false
                ),HttpStatus.BAD_REQUEST);
            }
            if (e.getMessage().contains("already exists")) {
                return new ResponseEntity<>(new ResponseWrapper<>(
                        LocalDateTime.now(),
                        HttpStatus.CONFLICT.value(),
                        "Already Exists:" + e.getMessage(),
                        null,
                        false
                ),HttpStatus.CONFLICT);
            }
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.BAD_REQUEST.value(),
                    "Error",
                    null,
                    false
            ),HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "An error occurred while adding employee",
                    null,
                    false
            ),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @PutMapping("/admin/employees/{id}")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<ResponseWrapper<Employees>> updateEmployeeId(
//            @PathVariable String id,
//            @RequestBody UpdateEmployeeIdDTO updateDto) {
//        try {
//            Employees updatedEmployee = employeeService.updateEmployeeId(id, updateDto.getNewId());
//            return ResponseEntity.ok(new ApiResponse<>(200, "Employee ID updated successfully", updatedEmployee, false));
//        } catch (IllegalArgumentException e) {
//            if (e.getMessage().contains("Employee not found")) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                        .body(new ApiResponse<>(404, "Employee not found", null, true));
//            }
//            if (e.getMessage().contains("already exists")) {
//                return ResponseEntity.status(HttpStatus.CONFLICT)
//                        .body(new ApiResponse<>(409, e.getMessage(), null, true));
//            }
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(new ApiResponse<>(400, e.getMessage(), null, true));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(new ApiResponse<>(500, "An error occurred while updating employee ID", null, true));
//        }
//    }


}

class UpdateEmployeeIdDTO {
    private String newId;

    public String getNewId() {
        return newId;
    }

    public void setNewId(String newId) {
        this.newId = newId;
    }
}