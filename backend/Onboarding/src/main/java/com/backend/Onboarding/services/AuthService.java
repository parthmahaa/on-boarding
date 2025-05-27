package com.backend.Onboarding.services;

import com.backend.Onboarding.entities.Employees;
import com.backend.Onboarding.repo.EmployeeRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final EmployeeRepo employeeRepo;
    private final PasswordEncoder passwordEncoder;

    public AuthService(EmployeeRepo employeeRepo, PasswordEncoder passwordEncoder) {
        this.employeeRepo = employeeRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public Employees authenticate(String email, String password) {
        Employees employee = employeeRepo.findByEmployeeEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(password, employee.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return employee;
    }


}