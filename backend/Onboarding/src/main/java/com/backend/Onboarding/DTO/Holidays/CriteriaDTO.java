package com.backend.Onboarding.DTO.Holidays;

import lombok.Data;

import java.util.List;

@Data
public class CriteriaDTO {
    private String field;
    private List<String> value;
}
