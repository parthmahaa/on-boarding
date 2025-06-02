package com.backend.Onboarding.repo;

import com.backend.Onboarding.entities.SBU;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SBURepo extends JpaRepository<SBU,Long> {

    List<SBU> findByCompanyCompanyId(UUID companyId);
}
