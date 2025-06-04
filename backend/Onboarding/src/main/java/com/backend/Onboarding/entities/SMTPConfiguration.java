package com.backend.Onboarding.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "SMPT_Configuration")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SMTPConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonBackReference(value = "company-approval-workflows")
    private CompanyEntity company;

    @Column(name = "hr_user_name")
    private String hrUserName;

    @Column(name = "hr_email_password")
    private String hrEmailPassword;

    @Column(name = "hr_from_email")
    private String hrFromEmail;

    @Column(name = "offer_username")
    private String offerUserName;

    @Column(name = "offer_email_password")
    private String offerEmailPassword;

    @Column(name = "offer_email")
    private String offerFromEmail;

    @Column(name = "smtp_server")
    private String smtpServer;

    @Column(name = "port")
    private String smtpPort;
}
