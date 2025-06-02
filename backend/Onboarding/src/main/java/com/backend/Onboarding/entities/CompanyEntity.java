    package com.backend.Onboarding.entities;

    import com.backend.Onboarding.utilities.CompanyStatus;
    import com.fasterxml.jackson.annotation.JsonFormat;
    import com.fasterxml.jackson.annotation.JsonManagedReference;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import org.hibernate.annotations.CreationTimestamp;
    import org.hibernate.annotations.UpdateTimestamp;

    import java.time.LocalDateTime;
    import java.util.ArrayList;
    import java.util.List;
    import java.util.UUID;

    @Entity
    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    @Table(name = "companies")
    public class CompanyEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        @Column(name = "company_id")
        private UUID companyId;

        @Column(name = "company_name", nullable = false, unique = true)
        private String companyName;

        @Column(name = "address")
        private String address;

        @Column(name = "GST_Registeration_Number")
        private String gstRegisterationNumber;

        @Column(name = "pincode", length = 6)
        private String pincode;

        @Column(name = "no_of_employees")
        private Double noOfEmployees;

        @Column(name = "short_name")
        private String shortName;

        @Column(nullable = false, unique = true)
        private String publicUrl;

        @Enumerated(EnumType.STRING)
        @Column(name = "status")
        private CompanyStatus status = CompanyStatus.CREATED; // Default to CREATED

        @OneToMany(mappedBy = "company", cascade = CascadeType.ALL,orphanRemoval = true, fetch = FetchType.LAZY)
        @JsonManagedReference
        private List<Employees> employees = new ArrayList<>();

        @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonManagedReference
        private List<SBU> sbus = new ArrayList<>();

        @CreationTimestamp
        @Column(name = "created_at", updatable = false)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm dd-MMM-yy")
        private LocalDateTime createdAt;

        @UpdateTimestamp
        @Column(name = "updated_at")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm dd-MMM-yy")
        private LocalDateTime updatedAt;
    }



