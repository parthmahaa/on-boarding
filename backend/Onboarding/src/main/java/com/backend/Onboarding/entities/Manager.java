package com.backend.Onboarding.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "managers")
@Data
public class Manager {

    @Id
    @Column(name = "id")
    private String id;

    private String companyName;

    private String firstName;

    private String lastName;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private CompanyEntity company;

    @OneToMany(mappedBy = "primaryManager")
    @JsonManagedReference
    private List<Employees> primaryManagedEmployees = new ArrayList<>();

    @OneToMany(mappedBy = "secondaryManager")
    @JsonManagedReference
    private List<Employees> secondaryManagedEmployees= new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm dd-MMM-yy")
    private LocalDateTime createdAt;

    @PrePersist
    @PreUpdate
    public void updateCompanyName(){
        if (this.company != null) {
            this.companyName = this.company.getCompanyName();
        }
    }
}
