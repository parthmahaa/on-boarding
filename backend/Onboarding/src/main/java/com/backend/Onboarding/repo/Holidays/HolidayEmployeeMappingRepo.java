package com.backend.Onboarding.repo.Holidays;

import com.backend.Onboarding.entities.Holidays.HolidayEmployeeMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public interface HolidayEmployeeMappingRepo extends JpaRepository<HolidayEmployeeMapping, Long> {

}
