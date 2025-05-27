package com.backend.Onboarding.DTO;

import com.backend.Onboarding.utilities.CompanyStatus;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class CompanyAdminDTO {
    private UUID id;
    private String companyName;
    private String shortName;
    private String gstRegistrationNumber;
    private String pincode;
    private String address;
    private Double noOfEmployees;
    private CompanyStatus companyStatus;
}