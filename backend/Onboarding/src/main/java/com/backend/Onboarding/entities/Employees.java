package com.backend.Onboarding.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @Column(name = "grade")
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

    @Column(name = "department")
    private String department;

    @Column
    private String subDepartment; // Optional (sub dept 1,2,3,4)

    @Column
    private Boolean countOffDayInAttendance; // Optional

    @Column
    private Boolean countHolidayInAttendance; // Optional

    @ManyToOne
    @JsonBackReference(value = "primaryManager")
    @JoinColumn(name = "primary_manager_id", nullable = true)
    private Manager primaryManager; // Optional

    @ManyToOne
    @JsonBackReference(value = "secondaryManager")
    @JoinColumn(name = "secondary_manager_id", nullable = true)
    private Manager secondaryManager; // Optional

    @Column
    private String paymentMethod; // Optional

    @Column
    private String aadharNo; // Optional

    @Column
    private String panNo; // Optional

        @ManyToMany
        @JoinTable(
                name = "employee_roles",
                joinColumns = @JoinColumn(name = "employee_id"),
                inverseJoinColumns = @JoinColumn(name = "role_id")
        )
        private Set<Roles> roles = new HashSet<>();

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "role")
    private String role; // Main role, can be set during registration or later

    // Existing fields retained
    @Column(name = "password")
    private String password;

    @Column()
    private String employeePhone;

    @Column(name = "status")
    private String status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDate createdAt;

    public String getCompanyName() {
        return companyName != null ? companyName : (company != null ? company.getCompanyName() : null);
    }

    public void handleStatus(){

    }
}

