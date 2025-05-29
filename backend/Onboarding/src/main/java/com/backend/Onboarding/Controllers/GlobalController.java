package com.backend.Onboarding.Controllers;

import com.backend.Onboarding.Config.ResponseWrapper;
import com.backend.Onboarding.DTO.CompanyBasicDTO;
import com.backend.Onboarding.services.CompanyService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class GlobalController{

    @Value("${app.onboarding.base-url}")
    private String baseUrl;

    private final CompanyService companyService;

    public GlobalController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping(path = "/{publicUrl}")
    public ResponseEntity<ResponseWrapper<CompanyBasicDTO>> getCompanyData(@PathVariable String publicUrl){
//        String url = baseUrl + "/" + publicUrl;
        try{
            CompanyBasicDTO company = companyService.getCompanyNameAndId(publicUrl);

            if (company == null) {
                return new ResponseEntity<>(new ResponseWrapper<>(
                        LocalDateTime.now(),
                        HttpStatus.NOT_FOUND.value(),
                        "Company Not Found",
                        null,
                        false
                ),HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.OK.value(),
                    "Company Found",
                    company,
                    false
            ),HttpStatus.OK);

        }catch (Exception e){
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Cannot Fetch Company",
                    null,
                    true
            ),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
