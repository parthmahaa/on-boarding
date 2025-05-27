package com.backend.Onboarding.DTO;

import com.backend.Onboarding.DTO.CompanyRegisterationDTO;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PendingRegistrationDTO {
    private String token;
    private CompanyRegisterationDTO registrationDTO;
    private String otp;
    private LocalDateTime expiry;
}