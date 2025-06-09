    package com.backend.Onboarding.entities;

    import com.backend.Onboarding.entities.WorkflowConfig.WorkflowConfiguration;
    import com.backend.Onboarding.utilities.CompanyStatus;
    import com.fasterxml.jackson.annotation.JsonFormat;
    import com.fasterxml.jackson.annotation.JsonManagedReference;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import org.hibernate.annotations.CreationTimestamp;
    import org.hibernate.annotations.UpdateTimestamp;

    import java.time.LocalDate;
    import java.time.LocalDateTime;
    import java.util.ArrayList;
    import java.util.List;
    import java.util.UUID;

    @Entity
    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    @Table(name = "tbl_companies")
    public class CompanyEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        @Column(name = "company_id")
        private UUID companyId;

        @Column(name = "company_name", nullable = false, unique = true)
        private String companyName;

        @Column(name = "logo")
        private String logo;

        @Column(name = "address")
        private String address;

        @Column(name = "city")
        private String city;

        @Column(name = "country")
        private String country;

        @Column(name = "state")
        private String state;

        @Column(name = "GST_Registeration_Number")
        private String gstRegisterationNumber;

        @Column(name = "TAN_Number")
        private String tanNumber;

        @Column(name = "PAN_Number")
        private String panNumber;

        @Column(name = "pincode", length = 6)
        private String pincode;

        @Column(name = "no_of_employees")
        private Double noOfEmployees;

        @Column(name = "short_name")
        private String shortName;

        @Column(name = "registration_date")
        private LocalDate registrationDate;

        @Column(name = "pfNumber")
        private String pfNumber;

        @Column(name = "ESIC_number")
        private String esicNumber;

        @Column(name = "gratuity_number")
        private String gratuityNumber;

        @Column(name = "emp_id_prefix")
        private String empIdPrefix;

        @Column(name = "emp_id_total_digits")
        private Integer totalDigits;

        @Column(name = "salary_slip_type")
        private String salarySlipType;

        @Column(name = "salary_slip_format")
        private String salarySlipFormat;

        @Column(name = "hr_phone_number")
        private String hrPhoneNumber;

        @Column(name = "hr_whatsapp_number")
        private String hrWhatsappPhoneNumber;

        @Column(nullable = false, unique = true)
        private String publicUrl;

        @Column(name = "company_url")
        private String companyUrl;

        @Column(name = "company_type")
        private String type;

        @Column(name = "company_bank_name")
        private String bankName;

        @Column(name = "company_acc_number")
        private String accountNumber;

        @Column(name = "company_branch_code")
        private String branchCode;

        @Column(name = "company_ifsc_code")
        private String IFSCcode;

        @Column(name = "company_bank_address")
        private String bankAddress;

        @Column(name = "identification_no")
        private String identificationNumber;

        @Enumerated(EnumType.STRING)
        @Column(name = "status")
        private CompanyStatus status = CompanyStatus.CREATED; // Default to CREATED

        @OneToMany(mappedBy = "company", cascade = CascadeType.ALL,orphanRemoval = true, fetch = FetchType.LAZY)
        @JsonManagedReference
        private List<Employees> employees = new ArrayList<>();

        @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonManagedReference
        private List<SBU> sbus = new ArrayList<>();

        @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonManagedReference
        private List<Branch> branches = new ArrayList<>();

        @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonManagedReference(value = "company-approval-workflows")
        private List<ApprovalWorkflow> approvalWorkflows = new ArrayList<>();

        @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonManagedReference(value = "company-workflow-config")
        private List<WorkflowConfiguration> workflowConfigurations = new ArrayList<>();

        @CreationTimestamp
        @Column(name = "created_at", updatable = false)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm dd-MMM-yy")
        private LocalDateTime createdAt;

        @UpdateTimestamp
        @Column(name = "updated_at")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm dd-MMM-yy")
        private LocalDateTime updatedAt;
    }



