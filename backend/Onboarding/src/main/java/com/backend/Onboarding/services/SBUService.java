package com.backend.Onboarding.services;

import com.backend.Onboarding.DTO.AddSbuDTO;
import com.backend.Onboarding.DTO.UpdateSbuDTO;
import com.backend.Onboarding.entities.Branch;
import com.backend.Onboarding.entities.CompanyEntity;
import com.backend.Onboarding.entities.HrEmails;
import com.backend.Onboarding.entities.SBU;
import com.backend.Onboarding.repo.CompanyRepo;
import com.backend.Onboarding.repo.SBURepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SBUService {

    private final SBURepo sbuRepo;
    private final CompanyRepo companyRepo;

    public SBUService(SBURepo sbuRepo, CompanyRepo companyRepo) {
        this.sbuRepo = sbuRepo;
        this.companyRepo = companyRepo;
    }

    public List<UpdateSbuDTO> getSBUListByCompanyId(UUID companyId){
         List<SBU> sbus = sbuRepo.findByCompanyCompanyId(companyId);

         return sbus.stream()
                 .map(this::mapToUpdateSbuDTO)
                 .toList();
    }

    public SBU addSbu(AddSbuDTO dto){
        CompanyEntity company = companyRepo.findById(UUID.fromString(dto.getCompanyId().toString()))
                .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + dto.getCompanyId()));

        SBU sbu = new SBU();
        sbu.setCompany(company);
        sbu.setCompanyLogo(dto.getCompanyLogo());
        sbu.setName(dto.getName());
        sbu.setShortName(dto.getShortName());
        sbu.setUrl(dto.getUrl());
        sbu.setType(dto.getType());
        sbu.setRegistrationDate(dto.getRegistrationDate());
        sbu.setIdentificationNumber(dto.getIdentificationNumber());
        sbu.setTanNumber(dto.getTanNumber());
        sbu.setCreatedBy(dto.getCreatedBy());
        sbu.setPanNumber(dto.getPanNumber());
        sbu.setPincode(dto.getPincode());
        sbu.setCountry(dto.getCountry());
        sbu.setState(dto.getState());
        sbu.setCity(dto.getCity());
        sbu.setPhoneNumber(dto.getPhoneNumber());
        sbu.setAddress(dto.getAddress());
        sbu.setSalarySlipFormat(dto.getSalarySlipFormat());

        if(dto.isEmployeeIdBySBU()){
            sbu.setEmpNoPrefix(dto.getEmpNoPrefix());
            sbu.setTotalDigits(dto.getTotalDigits());
        }else{
            sbu.setEmpNoPrefix(company.getEmpIdPrefix());
            sbu.setTotalDigits(company.getTotalDigits() != null ? company.getTotalDigits() : 3); // Default to 0 or another sensible value
        }
        sbu.setHrPhoneNumber(dto.getHrPhoneNumber());
        sbu.setHrWhatsappPhoneNumber(dto.getHrWhatsappPhoneNumber());
        sbu.setTicketUpdates(dto.isTicketUpdates());
        sbu.setBankName(dto.getBankName());
        sbu.setAccountNumber(dto.getAccountNumber());
        sbu.setBranchCode(dto.getBranchCode());
        sbu.setIFSCcode(dto.getIFSCcode());
        sbu.setBankAddress(dto.getBankAddress());

        if (dto.getHrEmails() != null && !dto.getHrEmails().isEmpty()) {
            List<HrEmails> hrEmails = new ArrayList<>();
            for (String email : dto.getHrEmails()) {
                HrEmails hrEmail = new HrEmails();
                hrEmail.setEmail(email);
                hrEmail.setSbu(sbu);
                hrEmails.add(hrEmail);
            }
            sbu.setHrEmails(hrEmails);
        }

        // Save the SBU (cascades to HrEmail due to CascadeType.ALL)
        return sbuRepo.save(sbu);
    }

    @Transactional
    public UpdateSbuDTO editSbu(Long id, UpdateSbuDTO updates) {
        SBU sbuToEdit = sbuRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("SBU NOT FOUND"));

        if (updates.getCompanyLogo() != null) sbuToEdit.setCompanyLogo(updates.getCompanyLogo());
        if (updates.getName() != null) sbuToEdit.setName(updates.getName());
        if (updates.getShortName() != null) sbuToEdit.setShortName(updates.getShortName());
        if (updates.getUrl() != null) sbuToEdit.setUrl(updates.getUrl());
        if (updates.getType() != null) sbuToEdit.setType(updates.getType());
        if (updates.getRegistrationDate() != null) sbuToEdit.setRegistrationDate(updates.getRegistrationDate());
        if (updates.getIdentificationNumber() != null) sbuToEdit.setIdentificationNumber(updates.getIdentificationNumber());
        if (updates.getTanNumber() != null) sbuToEdit.setTanNumber(updates.getTanNumber());
        if (updates.getPanNumber() != null) sbuToEdit.setPanNumber(updates.getPanNumber());
        if (updates.getPincode() != null) sbuToEdit.setPincode(updates.getPincode());
        if (updates.getCountry() != null) sbuToEdit.setCountry(updates.getCountry());
        if (updates.getState() != null) sbuToEdit.setState(updates.getState());
        if (updates.getCity() != null) sbuToEdit.setCity(updates.getCity());
        if (updates.getPhoneNumber() != null) sbuToEdit.setPhoneNumber(updates.getPhoneNumber());
        if (updates.getAddress() != null) sbuToEdit.setAddress(updates.getAddress());
        if (updates.getSalarySlipFormat() != null) sbuToEdit.setSalarySlipFormat(updates.getSalarySlipFormat());
        if (updates.getEmpNoPrefix() != null) sbuToEdit.setEmpNoPrefix(updates.getEmpNoPrefix());
        if (updates.getTotalDigits() != null) sbuToEdit.setTotalDigits(updates.getTotalDigits());
        if (updates.getHrPhoneNumber() != null) sbuToEdit.setHrPhoneNumber(updates.getHrPhoneNumber());
        if (updates.getHrWhatsappPhoneNumber() != null) sbuToEdit.setHrWhatsappPhoneNumber(updates.getHrWhatsappPhoneNumber());
        if (updates.getTicketUpdates() != null) sbuToEdit.setTicketUpdates(updates.getTicketUpdates());
        if (updates.getBankName() != null) sbuToEdit.setBankName(updates.getBankName());
        if (updates.getAccountNumber() != null) sbuToEdit.setAccountNumber(updates.getAccountNumber());
        if (updates.getBranchCode() != null) sbuToEdit.setBranchCode(updates.getBranchCode());
        if (updates.getIFSCcode() != null) sbuToEdit.setIFSCcode(updates.getIFSCcode());
        if (updates.getBankAddress() != null) sbuToEdit.setBankAddress(updates.getBankAddress());
        if (updates.getGstNumber() != null) sbuToEdit.setGstNumber(updates.getGstNumber());
        if (updates.getEmployeeIdBySBU() != null) sbuToEdit.setEmployeeIdBySBU(updates.getEmployeeIdBySBU());

        // Handle hrEmails if needed (update logic as per your requirements)

        SBU updatedSbu = sbuRepo.save(sbuToEdit);
        return mapToUpdateSbuDTO(updatedSbu);
    }

    public String updateStatus(Long sbuId) {
        SBU sbu = sbuRepo.findById(sbuId)
                .orElseThrow(() -> new IllegalArgumentException("SBU not found with ID: " + sbuId));
        boolean currentStatus = sbu.getSbuStatus() != null ? sbu.getSbuStatus() : true;
        sbu.setSbuStatus(!currentStatus);
        sbuRepo.save(sbu);
        return "SBU status updated for ID: " + sbuId;
    }

    public List<String> getAllUniqueSbuNamesByCompanyId(UUID companyId) {
        return sbuRepo.findByCompanyCompanyId(companyId).stream()
                .map(SBU::getName)
                .filter(name -> name != null && !name.isEmpty())
                .distinct()
                .toList();
    }

    public UpdateSbuDTO mapToUpdateSbuDTO(SBU sbu) {
        UpdateSbuDTO dto = new UpdateSbuDTO();
        dto.setId(sbu.getId());
        dto.setCompanyLogo(sbu.getCompanyLogo());
        dto.setName(sbu.getName());
        dto.setShortName(sbu.getShortName());
        dto.setUrl(sbu.getUrl());
        dto.setType(sbu.getType());
        dto.setRegistrationDate(sbu.getRegistrationDate());
        dto.setPincode(sbu.getPincode());
        dto.setCountry(sbu.getCountry());
        dto.setCreatedBy(sbu.getCreatedBy());
        dto.setState(sbu.getState());
        dto.setCity(sbu.getCity());
        dto.setPanNumber(sbu.getPanNumber());
        dto.setTanNumber(sbu.getTanNumber());
        dto.setIdentificationNumber(sbu.getIdentificationNumber());
        dto.setGstNumber(sbu.getGstNumber());
        dto.setSalarySlipFormat(sbu.getSalarySlipFormat());
        dto.setEmployeeIdBySBU(sbu.isEmployeeIdBySBU());
        dto.setEmpNoPrefix(sbu.getEmpNoPrefix());
        dto.setTotalDigits(sbu.getTotalDigits());
        dto.setPhoneNumber(sbu.getPhoneNumber());
        dto.setAddress(sbu.getAddress());
        dto.setHrPhoneNumber(sbu.getHrPhoneNumber());
        dto.setHrWhatsappPhoneNumber(sbu.getHrWhatsappPhoneNumber());
        dto.setHrEmails(sbu.getHrEmails().stream()
                .map(HrEmails::getEmail)
                .collect(Collectors.toList()));
        dto.setTicketUpdates(sbu.isTicketUpdates());
        dto.setBankName(sbu.getBankName());
        dto.setAccountNumber(sbu.getAccountNumber());
        dto.setBankAddress(sbu.getBankAddress());
        dto.setIFSCcode(sbu.getIFSCcode());
        dto.setSbuStatus(sbu.getSbuStatus());
        return dto;
    }
}
