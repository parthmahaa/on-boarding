package com.backend.Onboarding.repo.Holidays;

import com.backend.Onboarding.entities.Holidays.HolidayAllocationDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HolidayAllocationDetailsRepo extends JpaRepository<HolidayAllocationDetails, Long> {

    List<HolidayAllocationDetails> findByHolidayIdAndStatus(Long holidayId, String status);

    List<HolidayAllocationDetails> findByStatus(String status);

}

