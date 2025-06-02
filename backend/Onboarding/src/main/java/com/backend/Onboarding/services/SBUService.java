package com.backend.Onboarding.services;

import com.backend.Onboarding.DTO.AddSbuDTO;
import com.backend.Onboarding.entities.CompanyEntity;
import com.backend.Onboarding.entities.HrEmails;
import com.backend.Onboarding.entities.SBU;
import com.backend.Onboarding.repo.CompanyRepo;
import com.backend.Onboarding.repo.SBURepo;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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
}
