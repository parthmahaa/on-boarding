package com.backend.Onboarding.DTO;

import lombok.Data;

import java.util.UUID;

@Data
public class CompanyBasicDTO {

    private String publicUrl;
    private String companyName;
    private String companyId;
}
