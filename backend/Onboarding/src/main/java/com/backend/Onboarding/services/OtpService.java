package com.backend.Onboarding.services;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class OtpService {

    private final SecureRandom random = new SecureRandom();

    public String generateOtp() {
        // Generate a 6-digit OTP
        return String.format("%06d", random.nextInt(999999));
    }

    public boolean verifyOtp(String providedOtp, String storedOtp, LocalDateTime expiry) {
        if (providedOtp == null || storedOtp == null || expiry == null) {
            return false;
        }
        //check for otp expiry
        if (LocalDateTime.now().isAfter(expiry)) {
            return false;
        }
        return providedOtp.equals(storedOtp);
    }

    public LocalDateTime calculateExpiry() {
        // OTP expires after 10 minutes
        return LocalDateTime.now().plus(10, ChronoUnit.MINUTES);
    }
}