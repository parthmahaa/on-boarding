package com.backend.Onboarding.Controllers;

import com.backend.Onboarding.Config.ResponseWrapper;
import com.backend.Onboarding.DTO.CompanyDTO;
import com.backend.Onboarding.DTO.CompanyRegisterationDTO;
import com.backend.Onboarding.entities.*;
import com.backend.Onboarding.services.CompanyService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    private final CompanyService companyService;
    private final ModelMapper modelMapper;

    public CompanyController(CompanyService companyService, ModelMapper modelMapper) {
        this.companyService = companyService;
        this.modelMapper = modelMapper;
    }

//    @GetMapping(path = "/getCompanyDetails/{name}")
//    public ResponseEntity<ResponseWrapper<CompanyDTO>> getCompanyDetails(@PathVariable @Valid String name){
//
//        CompanyDTO company = companyService.getCompanyDetails(name);
//
//        if(company == null){
//            ResponseWrapper<CompanyDTO> response = new ResponseWrapper<>(LocalDateTime.now(),
//                    HttpStatus.NOT_FOUND.value(),
//                    "Company Not Found",
//                    null,
//                    false);
//
//            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
//        }
//
//        ResponseWrapper<CompanyDTO> response = new ResponseWrapper<>(LocalDateTime.now(),
//                HttpStatus.ACCEPTED.value(),
//                "Company Found",
//                company,
//                false);
//
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }

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
            throw  new RuntimeException("Failed To add Company:" +e.getMessage());
        }
    }
}
