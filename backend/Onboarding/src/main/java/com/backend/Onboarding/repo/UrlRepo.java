package com.backend.Onboarding.repo;

import com.backend.Onboarding.entities.Urls;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UrlRepo extends JpaRepository<Urls, UUID> {
    Urls findByUrlToken(String urlToken);
}
