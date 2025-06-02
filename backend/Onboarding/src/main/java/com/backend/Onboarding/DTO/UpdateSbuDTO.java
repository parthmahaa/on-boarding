package com.backend.Onboarding.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class UpdateSbuDTO {

    private String companyLogo;

    @NotNull(message = "Please provide company name")
    private String name;

    @NotNull(message = "Please provide short name")
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

    private String city;

    private String phoneNumber;

    private String address;

    // HR details
    private String salarySlipFormat;
    private boolean employeeIdBySBU;

    private String empNoPrefix;
    private Integer totalDigits;

    private String hrPhoneNumber;
    private String hrWhatsappPhoneNumber;

    // List of HR emails
    private List<String> hrEmails;

    private boolean ticketUpdates;

    // Bank details
    private String bankName;
    private String accountNumber;
    private String branchCode;
    private String IFSCcode;
    private String bankAddress;

}