package com.backend.Onboarding.Controllers;

import com.backend.Onboarding.Config.ResponseWrapper;
import com.backend.Onboarding.DTO.BranchDTO;
import com.backend.Onboarding.services.BranchService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/branch")
public class BranchController {

    private final BranchService branchService;

    public BranchController(BranchService branchService) {
        this.branchService = branchService;
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<ResponseWrapper<List<BranchDTO>>> getBranches(@PathVariable String id){
        UUID companyId = UUID.fromString(id);

        List<BranchDTO> branches =  branchService.getBranchByCompanyId(companyId);

        if(branches == null){
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.NO_CONTENT.value(),
                    "NO branches found",
                    null,
                    true
            ), HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(new ResponseWrapper<>(
                LocalDateTime.now(),
                HttpStatus.OK.value(),
                "Branches Found",
                branches,
                false
        ),HttpStatus.OK);
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> addBranch(@PathVariable String id, @RequestBody @Valid BranchDTO branchDTO){
        UUID companyId = UUID.fromString(id);

        BranchDTO addedBranch = branchService.addBranch(companyId,branchDTO);

        return new ResponseEntity<>(new ResponseWrapper<>(
                LocalDateTime.now(),
                HttpStatus.OK.value(),
                "Branch Added",
                addedBranch,
                false
        ),HttpStatus.OK);

    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<?> updateBranchStatus(@PathVariable Long id){

        String response = branchService.updateStatus(id);

        return new ResponseEntity<>(new ResponseWrapper<>(
                LocalDateTime.now(),
                HttpStatus.ACCEPTED.value(),
                "Status Updated",
                response,
                false
        ),HttpStatus.ACCEPTED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> editBranch(@PathVariable Long id, @RequestBody @Valid BranchDTO updates){

        BranchDTO editedBranch = branchService.editBranch(id,updates);

        return new ResponseEntity<>(new ResponseWrapper<>(
                LocalDateTime.now(),
                HttpStatus.OK.value(),
                "Branch Updated",
                editedBranch,
                false
        ),HttpStatus.OK);
    }

    @GetMapping("/{id}/names")
    public ResponseEntity<ResponseWrapper<List<String>>> getUniqueBranchNames(@PathVariable String id) {
        UUID companyId = UUID.fromString(id);
        List<String> uniqueNames = branchService.getUniqueBranchNamesByCompanyId(companyId);

        return new ResponseEntity<>(new ResponseWrapper<>(
                LocalDateTime.now(),
                HttpStatus.OK.value(),
                "Unique Branch Names Found",
                uniqueNames,
                false
        ), HttpStatus.OK);
    }
}
