package com.backend.Onboarding.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SMTPSetupDTO {

    private String companyId;

    private String hrUserName;

    private String hrEmailPassword;

    @Email(message = "HR Email is required")
    private String hrFromEmail;

    private String offerUserName;

    private String offerEmailPassword;

    @Email(message = "Offer Email is required")
    private String offerFromEmail;

    @NotNull(message = "SMTP Server is required")
    private String smtpServer;

    @NotNull(message = "SMTP Port is required")
    private String smtpPort;
}
