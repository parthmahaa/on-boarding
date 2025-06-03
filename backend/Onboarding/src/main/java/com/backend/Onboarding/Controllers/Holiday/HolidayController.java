package com.backend.Onboarding.Controllers.Holiday;

import com.backend.Onboarding.Config.ResponseWrapper;
import com.backend.Onboarding.DTO.Holidays.HolidayAllocationDetailDTO;
import com.backend.Onboarding.DTO.Holidays.HolidayDetailsDTO;
import com.backend.Onboarding.entities.Holidays.HolidayDetails;
import com.backend.Onboarding.services.Holidays.HolidayService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/holidays")
public class HolidayController {

    @Autowired
    private HolidayService holidayService;

    @PostMapping("/add")
    public ResponseEntity<?> addHoliday(@RequestBody @Valid HolidayDetailsDTO holidayDetailsDTO) {
        HolidayDetailsDTO holiday = holidayService.addHoliday(holidayDetailsDTO);

        return ResponseEntity.ok(new ResponseWrapper<>(
                LocalDateTime.now(),
                HttpStatus.OK.value(),
                "Holiday Created",
                holiday,
                false
        ));
    }

    @PostMapping("/assign")
    public ResponseEntity<?> assignHolidayToEmployees(@RequestBody HolidayAllocationDetailDTO assignmentDTO) {
        String response = holidayService.assignHolidayToEmployees(assignmentDTO);
        return ResponseEntity.ok(new ResponseWrapper<>(
                LocalDateTime.now(),
                HttpStatus.OK.value(),
                "Holidays Allocated",
                response,
                false
        ));
    }

    @GetMapping("/list")
    public ResponseEntity<?> listHolidays(@RequestParam String companyId) {
        List<HolidayDetails> holidayDetails= holidayService.listHolidaysByCompany(companyId);
        List<HolidayDetailsDTO> holidayDTOs = holidayDetails.stream()
                .map(holidayService::mapToHolidayDetailsDTO)
                .toList();

        return new ResponseEntity<>(new ResponseWrapper<>(LocalDateTime.now(),HttpStatus.OK.value() ,"Holidays Fetched" ,holidayDTOs, false), HttpStatus.OK);
    }
}
