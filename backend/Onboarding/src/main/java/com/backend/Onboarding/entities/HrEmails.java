package com.backend.Onboarding.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_hr_emails")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HrEmails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sbu_id", nullable = false)
    @JsonBackReference
    private SBU sbu;
}