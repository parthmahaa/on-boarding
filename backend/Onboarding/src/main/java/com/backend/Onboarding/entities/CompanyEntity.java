package com.backend.Onboarding.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
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

    @OneToOne(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Urls url;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm dd-MMM-yy")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm dd-MMM-yy")
    private LocalDateTime updatedAt;
}



