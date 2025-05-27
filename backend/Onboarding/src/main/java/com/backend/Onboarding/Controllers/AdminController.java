package com.backend.Onboarding.Controllers;

import com.backend.Onboarding.Config.ResponseWrapper;
import com.backend.Onboarding.DTO.CompanyAdminDTO;
import com.backend.Onboarding.DTO.EmployeeAdminDTO;
import com.backend.Onboarding.services.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/getCompanies")
    public ResponseEntity<ResponseWrapper<List<CompanyAdminDTO>>> getAllCompanies(@RequestParam(value = "includeEmployees" ,defaultValue = "false") boolean includeEmployees){
        try{
            List<CompanyAdminDTO> companies = adminService.getAllCompanies(includeEmployees);
            ResponseWrapper<List<CompanyAdminDTO>> response = new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.OK.value(),
                    "Fetched Companies",
                    companies,
                    false
            );

            return new ResponseEntity<>(response,HttpStatus.OK);
        }
        catch (Exception e){
            throw new RuntimeException("Failed to fetch Company Details");
        }
    }

    @DeleteMapping("/deleteCompany/{id}")
    public ResponseEntity<ResponseWrapper<String>> deleteCompany(@PathVariable String id){
        try{
            adminService.deleteCompany(id);
            ResponseWrapper<String> response = new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.OK.value(),
                    "Company Deleted",
                    "Company Dropped",
                    false
            );
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            ResponseWrapper<String> response = new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Failed to Delete",
                    "Failed to Delete",
                    false
            );

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getEmployeeDetails/{companyId}")
    public ResponseEntity<ResponseWrapper<List<EmployeeAdminDTO>>> getCompanyEmployees(@PathVariable String companyId) {
        try {
            List<EmployeeAdminDTO> employees = adminService.getCompanyEmployees(companyId);
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.OK.value(),
                    "Employees Fetched Successfully",
                    employees,
                    false
            ),HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("Invalid UUID format")) {
                return new ResponseEntity<>(new ResponseWrapper<>(
                        LocalDateTime.now(),
                        HttpStatus.BAD_REQUEST.value(),
                        "Incorrect UUID format",
                        null,
                        true
                ), HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.NOT_FOUND.value(),
                    "Company not Found",
                    null,
                    true
            ),HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Company not found")) {
                return new ResponseEntity<>(new ResponseWrapper<>(
                        LocalDateTime.now(),
                        HttpStatus.NOT_FOUND.value(),
                        "Company not Found",
                        null,
                        true
                ),HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(new ResponseWrapper<>(
                    LocalDateTime.now(),
                    HttpStatus.NOT_FOUND.value(),
                    "An error Occured",
                    null,
                    true
            ),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
