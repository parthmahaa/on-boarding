package com.backend.Onboarding.DTO.Holidays;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HolidayDetailsHistoryDTO {
    private Long id;

    private Long holidayDetailsId;

    private String holidayName;

    private LocalDate holidayDate;

    private String holidayDateString;

    private String holidayType;

    private Boolean isPayableHoliday;

    private Boolean isOptionalHoliday;

    private Boolean isContinuousHoliday;

    private String status;

    private Long count;

    private Boolean toggleValue;

    private String createdBy;

    private String createdDate;

    public HolidayDetailsHistoryDTO(Object[] data) {
        this.id = Long.valueOf(data[0].toString());
        this.holidayName = data[1].toString();

        this.holidayType = data[3].toString();
        this.isOptionalHoliday = Objects.isNull(data[4]) ? false : Boolean.valueOf(data[4].toString());
        this.isPayableHoliday = Objects.isNull(data[5]) ? false : Boolean.valueOf(data[5].toString());
        this.isContinuousHoliday = Objects.isNull(data[6]) ? false : Boolean.valueOf(data[6].toString());
        this.status = data[7].toString();
        this.toggleValue = data[7].toString().equalsIgnoreCase("ACTIVE") ? true : false;
        this.count = Long.parseLong(data[8].toString());
        this.createdBy = data[9].toString();
    }

}
