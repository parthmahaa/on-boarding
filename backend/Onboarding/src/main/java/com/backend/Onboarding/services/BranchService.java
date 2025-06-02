package com.backend.Onboarding.services;

import com.backend.Onboarding.DTO.BranchDTO;
import com.backend.Onboarding.entities.Branch;
import com.backend.Onboarding.entities.CompanyEntity;
import com.backend.Onboarding.repo.BranchRepo;
import com.backend.Onboarding.repo.CompanyRepo;
import org.springframework.stereotype.Service;

import java.util.List;import java.util.Map;
import java.util.UUID;

@Service
public class BranchService {

    private final BranchRepo branchRepo;
    private final CompanyRepo companyRepo;

    public BranchService(BranchRepo branchRepo, CompanyRepo companyRepo) {
        this.branchRepo = branchRepo;
        this.companyRepo = companyRepo;
    }

    public BranchDTO addBranch(UUID companyID, BranchDTO dto){
        CompanyEntity company = companyRepo.findById(companyID)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + companyID));
        Branch branch = mapToBranch(dto);
        branch.setCompany(company);
        try{
            Branch savedBranch = branchRepo.save(branch);
            return mapToBranchDTO(savedBranch);
        }catch (Exception e){
            throw new RuntimeException("Failed to save:" +e.getMessage());
        }
    }

    public List<BranchDTO> getBranchByCompanyId (UUID companyId) {
        List<Branch> branches = branchRepo.findAll().stream()
                .filter(branch -> branch.getCompany().getCompanyId().equals(companyId))
                .toList();

        return branches.stream()
                .map(this::mapToBranchDTO)
                .toList();
    }

    public BranchDTO editBranch(Long id, BranchDTO updates){
        Branch branchToEdit = branchRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        // Update only non-null fields from DTO
        if (updates.getBranchName() != null) branchToEdit.setBranchName(updates.getBranchName());
        if (updates.getPincode() != null) branchToEdit.setPincode(updates.getPincode());
        if (updates.getCountry() != null) branchToEdit.setCountry(updates.getCountry());
        if (updates.getState() != null) branchToEdit.setState(updates.getState());
        if (updates.getCity() != null) branchToEdit.setCity(updates.getCity());
        if (updates.getBranchAddress() != null) branchToEdit.setBranchAddress(updates.getBranchAddress());
        if (updates.getTimeZone() != null) branchToEdit.setTimeZone(updates.getTimeZone());
        if (updates.getIsPayrollBranch() != null) branchToEdit.setIsPayrollBranch(updates.getIsPayrollBranch());
        if (updates.getPTNumber() != null) branchToEdit.setPTNumber(updates.getPTNumber());
        if (updates.getLWNumber() != null) branchToEdit.setLWNumber(updates.getLWNumber());
        if (updates.getESICNumber() != null) branchToEdit.setESICNumber(updates.getESICNumber());
        if (updates.getStatus() != null) branchToEdit.setStatus(updates.getStatus());

        Branch editedBranch = branchRepo.save(branchToEdit);
        return mapToBranchDTO(editedBranch);
    }

    public Branch mapToBranch(BranchDTO dto){
        Branch branch = new Branch();
        branch.setBranchName(dto.getBranchName());
        branch.setPincode(dto.getPincode());
        branch.setCity(dto.getCity());
        branch.setCountry(dto.getCountry());
        branch.setState(dto.getState());
        branch.setBranchAddress(dto.getBranchAddress());
        branch.setTimeZone(dto.getTimeZone());
        branch.setIsPayrollBranch(dto.getIsPayrollBranch());

        branch.setPTNumber(dto.getPTNumber());
        branch.setLWNumber(dto.getLWNumber());
        branch.setESICNumber(dto.getESICNumber());
        branch.setStatus(dto.getStatus() != null ? dto.getStatus() : true);
        return branch;
    }

    public BranchDTO mapToBranchDTO(Branch branch){
        BranchDTO dto = new BranchDTO();

        dto.setBranchName(branch.getBranchName());
        dto.setPincode(branch.getPincode());
        dto.setCountry(branch.getCountry());
        dto.setState(branch.getState());
        dto.setCity(branch.getCity());
        dto.setBranchAddress(branch.getBranchAddress());
        dto.setTimeZone(branch.getTimeZone());
        dto.setIsPayrollBranch(branch.getIsPayrollBranch());
        dto.setPTNumber(branch.getPTNumber());
        dto.setLWNumber(branch.getLWNumber());
        dto.setESICNumber(branch.getESICNumber());
        dto.setStatus(branch.getStatus());
        return dto;
    }
}
