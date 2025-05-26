package com.backend.Onboarding.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendCredentialsEmailAsync(String toEmail, String username, String password) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Your Account Credentials for Company Onboarding");
            message.setText(
                    "Dear User,\n\n" +
                            "Your account has been created successfully. Below are your login credentials:\n\n" +
                            "Username: " + toEmail + "\n" +
                            "Password: " + password + "\n\n" +
                            "Please change your password after logging in for the first time.\n\n" +
                            "Best regards,\n" +
                            "Emgage"
            );
            message.setFrom("noreply.musafir@gmail.com");
            mailSender.send(message);
            System.out.println("Email sent to: " + toEmail);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email to " + toEmail + ": " + e.getMessage(), e);
        }
    }
}