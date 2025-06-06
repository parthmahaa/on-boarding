package com.backend.Onboarding.repo;

import com.backend.Onboarding.entities.Employees;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EmployeeRepo extends JpaRepository<Employees, String> {

    @EntityGraph(attributePaths = {"company"})
    Optional<Employees> findByEmployeeEmail(String email);

    @Query("SELECT e FROM Employees e JOIN FETCH e.company WHERE e.employeeEmail = :email")
    Optional<Employees> findByEmployeeEmailWithCompany(String email);
    boolean existsByEmployeeEmail(String email);

//    List<Employees> findBySbuAndBranchAndDesignationAndEmploymentTypeAndDepartmentAndStateAndGradeAndRole(
//            String sbu, String branch, String designation, String employmentType, String department, String state, String grade, String role
//    );

    List<Employees> findBySbu(String sbu);
    List<Employees> findByBranch(String sbu);
    List<Employees> findByDesignation(String designation);
    List<Employees> findByDepartment(String department);
    List<Employees> findByEmployeeType(String employeeType);
    List<Employees> findByEmploymentType(String employmentTyoe);
    List<Employees> findByGrade(String grade);
}
