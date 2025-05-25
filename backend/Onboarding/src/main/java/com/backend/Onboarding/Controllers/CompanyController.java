package com.backend.Onboarding.Controllers;

import com.backend.Onboarding.Config.ResponseWrapper;
import com.backend.Onboarding.DTO.CompanyRegisterationDTO;
import com.backend.Onboarding.services.CompanyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping(path = "/register")
    public ResponseEntity<ResponseWrapper<String>> addCompanyDetails(@RequestBody @Valid CompanyRegisterationDTO dto){
        try {
            String companyUrl = companyService.registerCompany(dto);
            ResponseWrapper<String> response = new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.CREATED.value(),
                    "Company Added",
                    companyUrl,
                    false
            );

            return  new ResponseEntity<>(response,HttpStatus.CREATED);
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
            throw  new RuntimeException(e.getMessage());
        }
    }
}
