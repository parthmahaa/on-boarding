package com.backend.Onboarding.DTO;

import com.backend.Onboarding.utilities.CompanyStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class CompanyDetailsDTO {
    private UUID id;
    private String companyName;
    private String logo;
    private String shortName;
    private String gstRegistrationNumber;
    private String url;
    private String type;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MMM-yy")
    private LocalDate registrationDate;
    private String identificationNumber;
    private String tanNumber;
    private String panNumber;
    private String pincode;
    private String city;
    private String state;
    private String country;
    private String address;
    private Double noOfEmployees;
    private String companyUrl;

    // In CompanyDetailsDTO.java
    private String pfNumber;
    private String esicNumber;
    private String gratuityNumber;
    private String empIdPrefix;
    private Integer totalDigits;
    private String salarySlipType;
    private String salarySlipFormat;
    private String hrPhoneNumber;
    private String hrWhatsappPhoneNumber;
    private String bankName;
    private String accountNumber;
    private String branchCode;
    private String IFSCcode;
    private String bankAddress;

    private CompanyStatus companyStatus;
}