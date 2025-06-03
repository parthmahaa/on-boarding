package com.backend.Onboarding.entities.Holidays;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_holidayAllocationDetails")
public class HolidayAllocationDetails {

    @Id
    @Column(name = "Id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "HolidayId")
    private Long holidayId;

    @Column(name = "Status")
    private String status;

    @Column(name = "CriteriaValue")
    private String criteriaValue;

}
