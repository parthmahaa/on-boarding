package com.backend.Onboarding.services;

import com.backend.Onboarding.DTO.AddSbuDTO;
import com.backend.Onboarding.DTO.UpdateSbuDTO;
import com.backend.Onboarding.entities.CompanyEntity;
import com.backend.Onboarding.entities.HrEmails;
import com.backend.Onboarding.entities.SBU;
import com.backend.Onboarding.repo.CompanyRepo;
import com.backend.Onboarding.repo.SBURepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.bind.annotation.PatchMapping;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

    public List<SBU> getSBUListByCompanyId(UUID companyId){
        return sbuRepo.findByCompanyCompanyId(companyId);
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
        sbu.setPanNumber(dto.getPanNumber());
        sbu.setPincode(dto.getPincode());
        sbu.setCountry(dto.getCountry());
        sbu.setState(dto.getState());
        sbu.setCity(dto.getCity());
        sbu.setPhoneNumber(dto.getPhoneNumber());
        sbu.setAddress(dto.getAddress());
        sbu.setSalarySlipFormat(dto.getSalarySlipFormat());
        sbu.setEmployeeIdBySBU(dto.isEmployeeIdBySBU());
        sbu.setEmpNoPrefix(dto.getEmpNoPrefix()); //  this is only set if employeeIdBySBU is true
        sbu.setTotalDigits(dto.getTotalDigits()); //  this is only set if employeeIdBySBU is true
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
    public UpdateSbuDTO editSbu(Long id, Map<String, Object> updates) {
        boolean exists = sbuRepo.existsById(id);
        if(exists){
            try {
                SBU sbuToEdit = sbuRepo.findById(id).orElseThrow(() -> new RuntimeException("SBU NOT FOUND"));
                updates.forEach((field, value)->{
                    Field fieldToUpdate = ReflectionUtils.findField(SBU.class,field);
                    if(fieldToUpdate != null){
                        fieldToUpdate.setAccessible(true);
                        ReflectionUtils.setField(fieldToUpdate,sbuToEdit,value);
                    }
                });

                SBU updatedSbu = sbuRepo.save(sbuToEdit);
                return mapToUpdateSbuDTO(updatedSbu) ;
            }catch (Exception e){
                throw new RuntimeException("failed to update SBU"+ e.getMessage());
            }
        }
        return null;
    }

    public UpdateSbuDTO mapToUpdateSbuDTO(SBU sbu) {
        UpdateSbuDTO dto = new UpdateSbuDTO();
        dto.setCompanyLogo(sbu.getCompanyLogo());
        dto.setName(sbu.getName());
        dto.setShortName(sbu.getShortName());
        dto.setUrl(sbu.getUrl());
        dto.setType(sbu.getType());
        dto.setRegistrationDate(sbu.getRegistrationDate());
        dto.setPincode(sbu.getPincode());
        dto.setCountry(sbu.getCountry());
        dto.setState(sbu.getState());
        dto.setCity(sbu.getCity());
        dto.setPanNumber(sbu.getPanNumber());
        dto.setTanNumber(sbu.getTanNumber())
        ;
        dto.setPhoneNumber(sbu.getPhoneNumber());
        dto.setAddress(sbu.getAddress());
        dto.setHrPhoneNumber(sbu.getHrPhoneNumber());
        dto.setHrWhatsappPhoneNumber(sbu.getHrWhatsappPhoneNumber());
        dto.setHrEmails(sbu.getHrEmails().stream()
                .map(HrEmails::getEmail)
                .collect(Collectors.toList()));
        dto.setTicketUpdates(sbu.isTicketUpdates());
        return dto;
    }
}
