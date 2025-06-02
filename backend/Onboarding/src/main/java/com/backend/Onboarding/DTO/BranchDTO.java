package com.backend.Onboarding.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BranchDTO {

    private String branchName;

    @Size(min = 6, max = 6, message = "Pincode must be exactly 6 digits")
    @Pattern(regexp = "\\d{6}", message = "Pincode must contain 6 digits")
    private String pincode;

    private String country;

    private String state;
    private String city;
    private String branchAddress;

    private String timeZone;

    private Boolean isPayrollBranch;

    //compliance details
    @JsonProperty("PTNumber")
    private String PTNumber;

    @JsonProperty("LWNumber")
    private String LWNumber;

    @JsonProperty("ESICNumber")
    private String ESICNumber;

}
