package com.backend.Onboarding.Controllers;

import com.backend.Onboarding.Config.ResponseWrapper;
import com.backend.Onboarding.DTO.CompanyBasicDTO;
import com.backend.Onboarding.DTO.CompanyRegisterationDTO;
import com.backend.Onboarding.entities.PendingRegistration;
import com.backend.Onboarding.services.CompanyService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseWrapper<String>> initiateRegistration(@RequestBody CompanyRegisterationDTO dto) {
        try {
            String token = companyService.initiateRegistration(dto);
            ResponseWrapper<String> response = new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.OK.value(),
                    "Registration Initiated",
                    token,
                    false
            );
            return new ResponseEntity<>(response,HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ResponseWrapper<String> response = new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.BAD_REQUEST.value(),
                    "Registration failed:" + e.getMessage(),
                    null,
                    true
            );

            return new ResponseEntity<>(response,HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            ResponseWrapper<String> response = new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.OK.value(),
                    "Registration Failed:"+ e.getMessage(),
                    null,
                    false
            );
            return new ResponseEntity<>(response,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/pending-registration/{token}")
    public ResponseEntity<ResponseWrapper<PendingRegistration>> getPendingRegistration(@PathVariable String token) {
        try {
            PendingRegistration pending = companyService.getPendingRegistration(token);
            if (pending == null) {

                ResponseWrapper<PendingRegistration> response = new ResponseWrapper<>(
                        LocalDateTime.now(),
                        HttpStatus.NOT_FOUND.value(),
                        "Registeration Details not Found",
                        null,
                        true
                );
                return new ResponseEntity<>(response,HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.OK.value(),
                    "Pending Registration",
                    pending,
                    false
            ),HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch Data:" +e.getMessage());
        }
    }

    @PostMapping("/complete-registration/{token}")
    public ResponseEntity<ResponseWrapper<String>> completeRegistration(
            @PathVariable String token,
            @RequestBody CompleteRegistrationDTO completeDTO) {
        try {
            String result = companyService.completeRegistration(token, completeDTO.getPassword(), completeDTO.getOtp());
            return ResponseEntity.ok(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.OK.value(),
                    "Company Onboarded",
                    result,
                    false
            ));

        } catch (IllegalArgumentException e) {
            ResponseWrapper<String> response = new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.BAD_REQUEST.value(),
                    "Registration Failed:"+ e.getMessage(),
                    null,
                    false
            );
            return new ResponseEntity<>(response,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{companyId}")
    public ResponseEntity<ResponseWrapper<CompanyBasicDTO>> getCompanyDetailsByCompanyId(@PathVariable String companyId) throws Exception {
        UUID id = UUID.fromString(companyId);
        try{
            CompanyBasicDTO company = companyService.getBasicCompanyDetails(id);
            if(company == null){
                return new ResponseEntity<>(new ResponseWrapper<>(
                        LocalDateTime.now(),
                        HttpStatus.NOT_FOUND.value(),
                        "Company Not Found",
                        null,
                        true
                ),HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.OK.value(),
                    "Company Found",
                    company,
                    false
            ), HttpStatus.OK);
        }catch (Exception e){
           throw new Exception("Error:" + e.getMessage());
        }
    }
}

@Getter
@Setter
class CompleteRegistrationDTO {
    private String password;
    private String otp;

}