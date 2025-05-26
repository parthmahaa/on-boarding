package com.backend.Onboarding.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "employees")
@Data
public class Employees
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private CompanyEntity company;

    @Column(nullable = false)
    private String employeeFirstName;

    @Column(nullable = false)
    private String employeeLastName;

    @Column(nullable = false, unique = true)
    private String employeeEmail;

    @Column(name = "password", nullable = false) // Add password field
    private String password;

    @Column(nullable = false)
    private String employeePhone;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "employee_roles", joinColumns = @JoinColumn(name = "employee_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Set<Roles> roles = new HashSet<>();

    @Column(name = "company_name")
    private String companyName;

    public String getCompanyName() {
        return companyName != null ? companyName : (company != null ? company.getCompanyName() : null);
    }

}