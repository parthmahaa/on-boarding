package com.backend.Onboarding.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "sbu")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SBU {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String companyLogo;

    @NotNull(message = "Please provide company name")
    private String name;

    @NotNull(message = "Please provide short name")
    private String shortName;

    private String url;

    private String type;

    private LocalDate registrationDate;

    private String identificationNumber;

    @Column(name = "gst_number")
    private String gstNumber;

    private String tanNumber;

    private String panNumber;

    // Address details
    private String pincode;

    private String country;

    private String state;

    private String city;

    private String phoneNumber;

    private String address;

    // HR details
    private String salarySlipFormat;
    private boolean employeeIdBySBU;

    private String empNoPrefix;
    private int totalDigits;

    private String hrPhoneNumber;
    private String hrWhatsappPhoneNumber;

    // Relationship to HR emails (store emails only if employeeIdBySBU is true)
    @OneToMany(mappedBy = "sbu", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<HrEmails> hrEmails = new ArrayList<>();

    private boolean ticketUpdates;

    // Bank details
    private String bankName;
    private String accountNumber;
    private String branchCode;
    private String IFSCcode;
    private String bankAddress;

    // Relationship to CompanyEntity
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name = "company_id", nullable = false)
    private CompanyEntity company;
}