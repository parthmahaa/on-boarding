// Onboarding/src/main/java/com/backend/Onboarding/Controllers/SMTPController.java
package com.backend.Onboarding.Controllers;

import com.backend.Onboarding.Config.ResponseWrapper;
import com.backend.Onboarding.DTO.SMTPSetupDTO;
import com.backend.Onboarding.services.SMTPService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/smtp")
public class SMTPController {

    private final SMTPService smtpService;

    public SMTPController(SMTPService smtpService) {
        this.smtpService = smtpService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addSmtpService(@RequestBody SMTPSetupDTO dto) {
        SMTPSetupDTO saved = smtpService.saveService(dto);
        return new ResponseEntity<>(new ResponseWrapper<>(
                LocalDateTime.now(),
                HttpStatus.CREATED.value(),
                "SMTP Service created",
                saved,
                false
        ), HttpStatus.CREATED);
    }

    @PostMapping("/test")
    public ResponseEntity<?> testSmtpService(@RequestBody SMTPSetupDTO dto) {
        boolean result = smtpService.testService(dto);
        return new ResponseEntity<>(new ResponseWrapper<>(
                LocalDateTime.now(),
                HttpStatus.OK.value(),
                result ? "SMTP Test successful" : "SMTP Test failed",
                result,
                !result
        ), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSmtpServiceDetails(@PathVariable String id) {
        UUID companyId = UUID.fromString(id);
        SMTPSetupDTO service = smtpService.getServiceDetails(companyId);
        return new ResponseEntity<>(new ResponseWrapper<>(
                LocalDateTime.now(),
                HttpStatus.OK.value(),
                "Service Details fetched",
                service,
                false
        ), HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateSmtpService(@PathVariable String id, @RequestBody SMTPSetupDTO dto) {
        UUID companyId = UUID.fromString(id);
        SMTPSetupDTO updated = smtpService.updateService(companyId, dto);
        return new ResponseEntity<>(new ResponseWrapper<>(
                LocalDateTime.now(),
                HttpStatus.OK.value(),
                "SMTP Service updated",
                updated,
                false
        ), HttpStatus.OK);
    }
}