package com.backend.Onboarding.DTO.Holidays;

import com.backend.Onboarding.entities.Holidays.HolidayDetails;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HolidayDetailsDTO {
    private Long id;

    @NotNull(message = "Name cannot be null")
    private String holidayName;

    @NotNull(message = "Date is mandatory")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MMM-yyyy")
    private LocalDate holidayDate;

    private String holidayType;

    //types of holiday
    private Boolean isHolidayPayApplicable;
    private Boolean isOptionalHoliday;
    private Boolean isRecurringHoliday;

    // active, inactive or history
    private String status;

    private Boolean toggleValue;

    @NotNull(message = "Company id cannot be null")
    private String companyId;
}
