package com.backend.Onboarding.entities.Holidays;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tbl_HolidayEmployeeMapping")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HolidayEmployeeMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "HolidayId")
    private Long holidayId;

    @Column(name = "HolidayAllocationId")
    private Long holidayAllocationId;

    @Column(name = "EmployeeId")
    private String employeeId;

    public HolidayEmployeeMapping(Long holidayId, Long holidayAllocationId, String emp) {
        this.holidayId = holidayId;
        this.holidayAllocationId = holidayAllocationId;
        this.employeeId = emp;
    }
}
