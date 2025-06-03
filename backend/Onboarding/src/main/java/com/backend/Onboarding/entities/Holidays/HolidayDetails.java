package com.backend.Onboarding.entities.Holidays;

import com.backend.Onboarding.entities.CompanyEntity;
import com.backend.Onboarding.utilities.HolidayConstants;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "tbl_holidayDetails")
@NoArgsConstructor
@AllArgsConstructor
public class HolidayDetails {
    @Id
    @Column(name = "Id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "HolidayName")
    private String holidayName;

    @Column(name = "HolidayDate")
    private LocalDate holidayDate;

    @Column(name = "HolidayType")
    private String holidayType;

    @Column(name = "IsOptionalHoliday")
    private Boolean isOptionalHoliday;

    @Column(name = "IsHolidayPayApplicable")
    private Boolean isHolidayPayApplicable;

    @Column(name = "IsContinuousHoliday")
    private Boolean isRecurringHoliday;

    @Column(name = "Status")
    @Enumerated(EnumType.STRING)
    private HolidayConstants.status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", referencedColumnName = "company_id")
    private CompanyEntity company;

//    public HolidayDetails(HolidayDetailsDTO holidayDetailsDTO) {
//        this.id = holidayDetailsDTO.getId();
//        this.holidayName = holidayDetailsDTO.getHolidayName();
//        this.holidayDate = holidayDetailsDTO.getHolidayDate();
//        this.holidayType = holidayDetailsDTO.getHolidayType();
//        this.isOptionalHoliday = holidayDetailsDTO.getIsOptionalHoliday();
//        this.isContinuousHoliday = holidayDetailsDTO.getIsContinuousHoliday();
//        this.isPayableHoliday = holidayDetailsDTO.getIsPayableHoliday();
//        this.status = LeaveHolidayConstant.Status.valueOf(holidayDetailsDTO.getStatus());
//    }

}
