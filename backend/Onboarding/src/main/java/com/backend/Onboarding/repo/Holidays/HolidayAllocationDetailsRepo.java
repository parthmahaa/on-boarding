package com.backend.Onboarding.repo.Holidays;

import com.backend.Onboarding.entities.Holidays.HolidayAllocationDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HolidayAllocationDetailsRepo extends JpaRepository<HolidayAllocationDetails, Long> {

}

