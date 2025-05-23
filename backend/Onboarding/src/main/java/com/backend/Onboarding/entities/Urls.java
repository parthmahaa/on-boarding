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
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "urls")
public class Urls {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "url_id")
    private UUID urlId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false, unique = true)
    private CompanyEntity company;

    @Column(name = "url_token", nullable = false, unique = true)
    private String urlToken;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm dd-MMM-yy")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm dd-MMM-yy")
    private LocalDateTime updatedAt;
}
