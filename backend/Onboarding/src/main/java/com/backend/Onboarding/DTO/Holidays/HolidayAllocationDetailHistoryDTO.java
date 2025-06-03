package com.backend.Onboarding.repo.Holidays;

import lombok.Data;

import java.util.Date;
import java.util.Objects;

@Data
public class HolidayAllocationDetailHistoryDTO {
    private Long id;

    private Long holidayId;

    private String status;

    private String criteriaValue;

    private String holidayName;

    private Integer allocationYear;

    private Date holidayDate;

    private String holidayDateString;

    private String holidayType;

    private Boolean isPayableHoliday;

    private Boolean isOptionalHoliday;

    private Boolean isContinuousHoliday;

    private String createdBy;

    private String createdDate;

    private Long count;

    public HolidayAllocationDetailHistoryDTO(Object[] data) throws Exception {
        this.id = Long.valueOf(data[0].toString());
        this.holidayName = data[1].toString();
        this.holidayType = data[3].toString();
        this.isOptionalHoliday = Objects.isNull(data[4]) ? false : Boolean.valueOf(data[4].toString());
        this.isPayableHoliday = Objects.isNull(data[5]) ? false : Boolean.valueOf(data[5].toString());
        this.isContinuousHoliday = Objects.isNull(data[6]) ? false : Boolean.valueOf(data[6].toString());
        this.status = data[7].toString();
        this.count = Long.parseLong(data[8].toString());
        this.criteriaValue = data[9].toString();
        this.createdBy = data[10].toString();
    }
}


