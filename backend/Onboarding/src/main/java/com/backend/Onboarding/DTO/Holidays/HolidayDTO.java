package com.backend.Onboarding.DTO.Holidays;

import lombok.Data;

import java.text.ParseException;
import java.time.LocalDate;

@Data
public class HolidayDTO {
    private Long hBranchId;

    private Long holidayId;

    private String holidayName;

    private LocalDate holidayDate;

    private String holidayType;

    private Integer isHolidayTaken;

    private Integer isOptionalHoliday;

    private Boolean isContinuousHoliday;

    private String type;

//    public String getStringOfHolidayDate(String format) {
//        return CommonConstant.DATE_TIME_FORMATTER_YYYY_MM_DD.format(this.holidayDate);
//    }
}

