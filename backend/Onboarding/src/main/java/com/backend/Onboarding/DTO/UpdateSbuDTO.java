package com.backend.Onboarding.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class UpdateSbuDTO {

    private Long id;

    private String companyLogo;

    private String name;

    private String shortName;

    private String url;

    private String type;

    private LocalDate registrationDate;

    private String identificationNumber;

    private String gstNumber;
    private String tanNumber;
    private String panNumber;

    // Address details
    private String pincode;

    private String country;

    private String state;

    private Boolean sbuStatus;

    private String city;

    private String phoneNumber;
    private String address;

    // HR details
    private String salarySlipFormat;
    private Boolean employeeIdBySBU;

    private String empNoPrefix;
    private Integer totalDigits;

    private String hrPhoneNumber;
    private String hrWhatsappPhoneNumber;

    // List of HR emails
    private List<String> hrEmails;

    private Boolean ticketUpdates;

    private String createdBy;

    // Bank details
    private String bankName;
    private String accountNumber;
    private String branchCode;
    private String IFSCcode;
    private String bankAddress;

}