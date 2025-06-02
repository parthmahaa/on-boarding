package com.backend.Onboarding.Controllers;

import com.backend.Onboarding.Config.ResponseWrapper;
import com.backend.Onboarding.DTO.AddSbuDTO;
import com.backend.Onboarding.DTO.UpdateSbuDTO;
import com.backend.Onboarding.entities.SBU;
import com.backend.Onboarding.services.SBUService;
import jakarta.validation.Valid;
import lombok.experimental.PackagePrivate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/sbu")
public class SBUController {

    private final SBUService sbuService;

    public SBUController(SBUService sbuService) {
        this.sbuService = sbuService;
    }

    @PostMapping(path = "/{id}")
    public ResponseEntity<ResponseWrapper<SBU>> addSbu(@PathVariable String id,@RequestBody @Valid AddSbuDTO sbuDTO ){
        try{
            UUID companyId = UUID.fromString(id);
            sbuDTO.setCompanyId(companyId);
            SBU sbus = sbuService.addSbu(sbuDTO);

            if(sbus == null){
                return new ResponseEntity<>(new ResponseWrapper<>(
                        LocalDateTime.now(),
                        HttpStatus.BAD_REQUEST.value(),
                        "No SBUs found",
                        null,
                        true
                ), HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.OK.value(),
                    "Fetched SBUs",
                    sbus,
                    false
            ),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "SERVER ERROR :" +e.getMessage(),
                    null,
                    true
            ),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<ResponseWrapper<List<UpdateSbuDTO>>> getSbus(@PathVariable String id) {
        UUID companyId = UUID.fromString(id);
        try {
            List<UpdateSbuDTO> sbus = sbuService.getSBUListByCompanyId(companyId);
            if (sbus == null) {
                return new ResponseEntity<>(new ResponseWrapper<>(
                        LocalDateTime.now(),
                        HttpStatus.NOT_FOUND.value(),
                        "NO SBUS FOUND",
                        null,
                        true
                ), HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.OK.value(),
                    "Fetched SBUs",
                    sbus,
                    false
            ), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "SERVER ERROR:" + e.getMessage(),
                    null,
                    false
            ), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping(path ="/{id}")
    public ResponseEntity<ResponseWrapper<UpdateSbuDTO>> editSbu(@PathVariable Long id, @RequestBody Map<String, Object> updates){
        UpdateSbuDTO edittedSbu = sbuService.editSbu(id,updates);

            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.OK.value(),
                    "SBU Updated",
                    edittedSbu,
                    false
                    ),HttpStatus.OK);

    }
}
