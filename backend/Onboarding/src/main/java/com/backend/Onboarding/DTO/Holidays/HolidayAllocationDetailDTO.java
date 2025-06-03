package com.backend.Onboarding.DTO.Holidays;

import com.backend.Onboarding.entities.Holidays.HolidayAllocationDetails;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HolidayAllocationDetailDTO {
    private Long id;

    private Long holidayId;

    private String status;

    private String criteriaValue;

    private String holidayName;

    private LocalDate holidayDate;

    private String holidayDateString;

    private String holidayType;

    private Boolean isPayableHoliday;

    private Boolean isOptionalHoliday;

    private Boolean isContinuousHoliday;

    private Boolean toggleValue;

    private Long count;

    public HolidayAllocationDetailDTO(HolidayAllocationDetails holidayAllocationDetails) {
        this.id = holidayAllocationDetails.getId();
        this.holidayId = holidayAllocationDetails.getHolidayId();
        this.status = holidayAllocationDetails.getStatus();
        this.criteriaValue = holidayAllocationDetails.getCriteriaValue();
    }

    public HolidayAllocationDetailDTO(Object[] data) {
        this.id = Long.valueOf(data[0].toString());
        this.holidayName = data[1].toString();
        try {
            this.holidayDate = LocalDate.parse((data[2]).toString());
        } catch (Exception exception) {
        }
        this.holidayType = data[3].toString();
        this.isOptionalHoliday = Objects.isNull(data[4]) ? false : Boolean.valueOf(data[4].toString());
        this.isPayableHoliday = Objects.isNull(data[5]) ? false : Boolean.valueOf(data[5].toString());
        this.isContinuousHoliday = Objects.isNull(data[6]) ? false : Boolean.valueOf(data[6].toString());
        this.status = data[7].toString();
        this.toggleValue = data[7].toString().equalsIgnoreCase("ACTIVE") ? true : false;
        this.count = Long.parseLong(data[8].toString());
        this.criteriaValue = data[9].toString();
        this.holidayId = Long.valueOf(data[10].toString());
    }

    @Override
    public boolean equals(java.lang.Object object) {
        return ((HolidayAllocationDetailDTO) object).getHolidayId().longValue() == this.holidayId.longValue();
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.holidayId);
    }

}