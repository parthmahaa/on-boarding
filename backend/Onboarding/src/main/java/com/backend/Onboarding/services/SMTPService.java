package com.backend.Onboarding.services;

import com.backend.Onboarding.Config.Exceptions.SmtpConfigNotFoundException;
import com.backend.Onboarding.DTO.SMTPSetupDTO;
import com.backend.Onboarding.entities.CompanyEntity;
import com.backend.Onboarding.entities.SMTPConfiguration;
import com.backend.Onboarding.repo.CompanyRepo;
import com.backend.Onboarding.repo.SmtpRepo;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.stereotype.Service;

import java.util.Properties;
import java.util.UUID;

@Service
public class SMTPService {

    private final SmtpRepo smtpRepo;
    private final CompanyRepo companyRepo;

    public SMTPService(SmtpRepo smtpRepo, CompanyRepo companyRepo) {
        this.smtpRepo = smtpRepo;
        this.companyRepo = companyRepo;
    }

    public SMTPSetupDTO saveService(SMTPSetupDTO dto) {
        try {
            SMTPConfiguration smtp = mapToSmtp(dto);
            SMTPConfiguration saved = smtpRepo.save(smtp);
            return mapToSmtpDTO(saved);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save SMTP service: " + e.getMessage(), e);
        }
    }

    public boolean testService(SMTPSetupDTO dto) {
        try {
            Properties props = new Properties();
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.host", dto.getSmtpServer());
            props.put("mail.smtp.port", dto.getSmtpPort());

            Session session = Session.getInstance(props, new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(dto.getHrUserName(), dto.getHrEmailPassword());
                }
            });

            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(dto.getHrFromEmail()));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(dto.getHrFromEmail()));
            message.setSubject("SMTP Test");
            message.setText("SMTP configuration test successful.");

            Transport.send(message);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    public SMTPSetupDTO getServiceDetails(UUID companyId) {
        try {
            SMTPConfiguration smtp = smtpRepo.findByCompanyCompanyId(companyId)
                    .orElseThrow(() -> new IllegalArgumentException("SMTP config not found for company: " + companyId));
            return mapToSmtpDTO(smtp);
        }catch (SmtpConfigNotFoundException e){
            throw new RuntimeException("SMTP Config not found");
        }
        catch (Exception e) {
            throw new RuntimeException("Failed to fetch SMTP service: " + e.getMessage(), e);
        }
    }

    public SMTPSetupDTO upsertService(SMTPSetupDTO dto) {
        UUID companyId = UUID.fromString(dto.getCompanyId());
        SMTPConfiguration smtp = smtpRepo.findByCompanyCompanyId(companyId).orElse(null);

        if (smtp == null) {
            // Create new
            smtp = mapToSmtp(dto);
        } else {
            // Update existing
            smtp.setHrFromEmail(dto.getHrFromEmail());
            smtp.setHrUserName(dto.getHrUserName());
            smtp.setHrEmailPassword(dto.getHrEmailPassword());
            smtp.setOfferFromEmail(dto.getOfferFromEmail());
            smtp.setOfferUserName(dto.getOfferUserName());
            smtp.setOfferEmailPassword(dto.getOfferEmailPassword());
            smtp.setSmtpServer(dto.getSmtpServer());
            smtp.setSmtpPort(dto.getSmtpPort());
        }
        SMTPConfiguration saved = smtpRepo.save(smtp);
        return mapToSmtpDTO(saved);
    }


    public SMTPConfiguration mapToSmtp(SMTPSetupDTO dto){
        SMTPConfiguration smtp = new SMTPConfiguration();
        CompanyEntity company = companyRepo.findById(UUID.fromString(dto.getCompanyId()))
                .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + dto.getCompanyId()));

        smtp.setCompany(company);
        //hr details
        smtp.setHrFromEmail(dto.getHrFromEmail());
        smtp.setHrUserName(dto.getHrUserName());
        smtp.setHrEmailPassword(dto.getHrEmailPassword());

        //offer details
        smtp.setOfferUserName(dto.getOfferUserName());
        smtp.setOfferFromEmail(dto.getOfferFromEmail());
        smtp.setOfferEmailPassword(dto.getOfferEmailPassword());

        smtp.setSmtpPort(dto.getSmtpPort());
        smtp.setSmtpServer(dto.getSmtpServer());

        return smtp;
    }

    public SMTPSetupDTO mapToSmtpDTO(SMTPConfiguration smtp){
        SMTPSetupDTO dto = new SMTPSetupDTO();
        dto.setCompanyId(smtp.getCompany().getCompanyId().toString());

        dto.setHrFromEmail(smtp.getHrFromEmail());
        dto.setHrUserName(smtp.getHrUserName());
        dto.setHrEmailPassword(smtp.getHrEmailPassword());

        dto.setOfferFromEmail(smtp.getOfferFromEmail());
        dto.setOfferUserName(smtp.getOfferUserName());
        dto.setOfferEmailPassword(smtp.getOfferEmailPassword());

        dto.setSmtpServer(smtp.getSmtpServer());
        dto.setSmtpPort(smtp.getSmtpPort());
        return dto;
    }
}
