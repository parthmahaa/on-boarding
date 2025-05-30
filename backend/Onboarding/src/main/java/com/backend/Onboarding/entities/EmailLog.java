//package com.xmplify.hris.tenant.model;
//
//import com.backend.Onboarding.DTO.EmailLogDTO;
//import com.xmplify.hris.tenant.constants.MailThrottlingConstant;
//import com.xmplify.hris.tenant.dto.EmailLogDTO;
//import jakarta.persistence.Column;
//import jakarta.persistence.Entity;
//import jakarta.persistence.EnumType;
//import jakarta.persistence.Enumerated;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.Table;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//import java.time.LocalDateTime;
//import java.util.Objects;
//
//@Entity
//@Table(name = "email_log")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//public class EmailLog {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id")
//    private Long id;
//
//    @Column(name = "sender")
//    private String sender;
//
//    @Column(name = "email_from")
//    private String from;
//
//    @Column(name = "email_to")
//    private String to;
//
//    @Column(name = "cc")
//    private String cc;
//
//    @Column(name = "bcc")
//    private String bcc;
//
//    @Column(name = "subject")
//    private String subject;
//
//    @Column(name = "body")
//    private String body;
//
//    @Column(name = "attachment")
//    private String attachment;
//
//    @Column(name = "success")
//    private Boolean success = false;
//
//    @Column(name = "sent_time")
//    private LocalDateTime sentTime;
//
//    @Column(name = "error")
//    private String error;
//
//    public EmailLog(EmailLogDTO emailLogDTO) {
//        this.sender = sanitizeString(emailLogDTO.getSender());
//        this.from = sanitizeString(emailLogDTO.getFrom());
//        this.to = sanitizeString(emailLogDTO.getTo());
//        this.cc = sanitizeString(emailLogDTO.getCc());
//        this.bcc = sanitizeString(emailLogDTO.getBcc());
//        this.subject = sanitizeString(emailLogDTO.getSubject());
//        this.body = sanitizeString(emailLogDTO.getBody());
//        this.attachment = sanitizeString(emailLogDTO.getAttachment());
//        this.error = sanitizeString(emailLogDTO.getError());
//        this.success = emailLogDTO.getSuccess();
//        this.sentTime = LocalDateTime.now();
//    }
//
//    private String sanitizeString(String input) {
//        return (Objects.isNull(input) ? null : input.replace("\0", ""));
//    }
//}
