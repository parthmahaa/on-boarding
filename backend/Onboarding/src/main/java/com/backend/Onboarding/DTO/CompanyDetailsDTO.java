package com.backend.Onboarding.DTO;

import com.backend.Onboarding.utilities.CompanyStatus;
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
    private LocalDateTime registrationDate;
    private Long identificationNumber;
    private String tanNumber;
    private String panNumber;
    private String pincode;
    private String city;
    private String state;
    private String country;
    private String address;
    private Double noOfEmployees;

    private CompanyStatus companyStatus;
}