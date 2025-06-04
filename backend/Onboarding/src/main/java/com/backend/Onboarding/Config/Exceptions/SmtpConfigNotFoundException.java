package com.backend.Onboarding.Config.Exceptions;

public class SmtpConfigNotFoundException extends RuntimeException {
    public SmtpConfigNotFoundException(String message) {
        super(message);
    }
}
