package com.backend.Onboarding.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "branches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "branch_name", nullable = false)
    private String branchName;

    @Column(name = "branch_address")
    private String branchAddress;

    private String city;

    private String state;

    private String country;

    private String pincode;

    private String timeZone;

    @Column(name = "professional_tax_number")
    private String PTNumber;

    @Column(name = "labour_welfare_number")
    private String LWNumber;

    private String ESICNumber;

    private Boolean status;

    @Column(name = "payroll_branch")
    private Boolean isPayrollBranch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonBackReference
    private CompanyEntity company;
}