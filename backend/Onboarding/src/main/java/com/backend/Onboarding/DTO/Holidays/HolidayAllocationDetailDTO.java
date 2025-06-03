package com.backend.Onboarding.DTO.Holidays;

import com.backend.Onboarding.entities.Holidays.HolidayAllocationDetails;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HolidayAllocationDetailDTO {

    private Long holidayId;

    private Long year;

    private String status;

    private List<CriteriaDTO> criteria;

    private List<String> employeeIds;
}
