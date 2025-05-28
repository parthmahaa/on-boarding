package com.backend.Onboarding.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "employees")
@Data
public class Employees {

    @Id
    @Column(name = "id")
    private String id; //DEFAULT- prefix of SBU + sequence

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonBackReference
    private CompanyEntity company;

    @Column(nullable = false)
    private String employeeFirstName;

    @Column
    private String employeeMiddleName; // Optional

    @Column(nullable = false)
    private String employeeLastName;

    @Column()
    private LocalDate dateOfJoining; // DOJ (mandatory)

    @Column()
    private LocalDate dateOfBirth; // DOB as per document (mandatory)

    @Column
    private LocalDate actualDateOfBirth; // DOB actual (optional)

    @Column()
    private String gender; // Mandatory

    @Column()
    private String sbu; // Mandatory (Strategic Business Unit)

    @Column()
    private String branch; // Mandatory

    @Column()
    private String complianceBranch; // Mandatory

    @Column()
    private String designation; // Mandatory

    @Column()
    private String grade; // Mandatory

    @Column()
    private String employeeType; // Mandatory

    @Column()
    private String employmentType; // Mandatory

    @Column
    private String probationStatus; // Mandatory

    @Column
    private LocalDate probationEndDate; // Optional

    @Column
    private LocalDate appraisalDate; // Optional

    @Column(name = "salaryOn")
    private String salaryOn; // Mandatory (Salary On)

    @Column
    private String employeeEmail; // Optional

    @Column
    private String subDepartment; // Optional (sub dept 1,2,3,4)

    @Column
    private Boolean countOffDayInAttendance; // Optional

    @Column
    private Boolean countHolidayInAttendance; // Optional

    @Column
    private String primaryManagerId; // Optional

    @Column
    private String secondaryManagerId; // Optional

    @Column
    private String paymentMethod; // Optional

    @Column
    private String aadharNo; // Optional

    @Column
    private String panNo; // Optional

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "employee_roles", joinColumns = @JoinColumn(name = "employee_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Set<Roles> roles = new HashSet<>();

    @Column(name = "company_name")
    private String companyName;

    // Existing fields retained
    @Column(name = "password")
    private String password;

    @Column()
    private String employeePhone;

    @Column(name = "status")
    private String status;

    public String getCompanyName() {
        return companyName != null ? companyName : (company != null ? company.getCompanyName() : null);
    }
}