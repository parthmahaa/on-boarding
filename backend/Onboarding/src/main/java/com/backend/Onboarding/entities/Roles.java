package com.backend.Onboarding.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tbl_roles")
@Data
public class Roles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String roleName;
}