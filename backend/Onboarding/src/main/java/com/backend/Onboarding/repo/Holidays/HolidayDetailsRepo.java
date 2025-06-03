package com.backend.Onboarding.repo.Holidays;

import com.backend.Onboarding.entities.Holidays.HolidayDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HolidayDetailsRepo extends JpaRepository<HolidayDetails,Long> {
    List<HolidayDetails> findByCompany_CompanyId(UUID companyId);
}
