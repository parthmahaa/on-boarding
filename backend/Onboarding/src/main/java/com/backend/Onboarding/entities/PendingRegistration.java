package com.backend.Onboarding.entities;

import com.backend.Onboarding.DTO.CompanyRegisterationDTO;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PendingRegistration {
    private String token; // Unique token for this registration
    private CompanyRegisterationDTO registrationDTO;
    private String otp; // OTP sent to the user's email
    private LocalDateTime expiry; // Expiry time for the OTP
}