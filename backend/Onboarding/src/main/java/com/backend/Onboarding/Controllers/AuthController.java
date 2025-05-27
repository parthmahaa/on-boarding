package com.backend.Onboarding.Controllers;

import com.backend.Onboarding.DTO.EmployeeAdminDTO;
import com.backend.Onboarding.DTO.LoginDTO;
import com.backend.Onboarding.entities.Employees;
import com.backend.Onboarding.entities.Roles;
import com.backend.Onboarding.services.AuthService;
import com.backend.Onboarding.Config.ResponseWrapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseWrapper<EmployeeAdminDTO>> login(@RequestBody LoginDTO loginDTO) {
        try {
            Employees employee = authService.authenticate(loginDTO.getEmail(), loginDTO.getPassword());
            EmployeeAdminDTO employeeDTO = new EmployeeAdminDTO();
            employeeDTO.setId(employee.getId());
            employeeDTO.setFirstName(employee.getEmployeeFirstName());
            employeeDTO.setLastName(employee.getEmployeeLastName());
            employeeDTO.setEmail(employee.getEmployeeEmail());
            employeeDTO.setPhone(employee.getEmployeePhone());
            employeeDTO.setRoles(employee.getRoles().stream()
                    .map(Roles::getRoleName)
                    .collect(Collectors.toSet()));
            ResponseWrapper<EmployeeAdminDTO> response = new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.OK.value(),
                    "Login Successful",
                    employeeDTO,
                    false
            );

            return new ResponseEntity<>(response,HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Failed to login: " + e.getMessage());
        }
    }
}