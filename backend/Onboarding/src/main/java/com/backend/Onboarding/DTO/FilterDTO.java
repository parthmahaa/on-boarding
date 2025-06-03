//package com.backend.Onboarding.DTO;
//
//import lombok.Data;
//
//import java.util.List;
//import java.util.Map;
//
//@Data
//public class FilterDTO_V2 {
//    private boolean showSearchButton;
//
//    private String empIdName;
//
//    private String empIdNameError;
//
//    private List<String> employee;
//
//    private List<String> employeeStatusObject;
//
//    private List<String> designation;
//
//    private String employeeIdError;
//
//    private List<String> sbuName;
//
//    private List<Integer> sbu;
//
//    private List<Integer> subDepartment;
//
//    private List<String> stateName;
//
//    private List<Integer> state;
//
//    private List<String> branchName;
//
//    private List<String> branch;
//
//    private List<String> departmentName;
//
//    private List<Long> grade;
//
//    private List<Long> employeeType;
//
//    private List<Long> employmentType;
//
//    private List<Integer> department;
//
//    private List<String> categoryName;
//
//    private List<Integer> category;
//
//    private List<String> managerId;
//
//    private List<String> penaltyStatus;
//
//    private String title;
//
//    private List<String> subCategory;
//
//    private List<String> payCadre;
//
//    private String isFreezed;
//
//    private String attendanceStatus;
//
//    private String employeeStatus;
//
//    private Integer month;
//
//    private String selectedDate;
//
//    private Integer year;
//
//    private String order;
//
//    private String orderBy;
//
//    private String dynamicField;
//
//    private String dynamicField2;
//
//    private String dynamicField3;
//
//    private String dynamicField4;
//
//    private String dynamicField5;
//
//    private String dynamicField6;
//
//    private String dynamicField7;
//
//    private String dynamicField8;
//
//    private String expenseFilterOn;
//
//    private String fromDate;
//
//    private String toDate;
//
//    private String status;
//
//    private String employeeName;
//
//    private String dueDate;
//
//    private String startDate;
//
//    private String endDate;
//
//    private String templateName;
//
//    private String type;
//
//    private String holidayName;
//
//    private List<String> types;
//
//    private List<String> freezeStatus;
//
//    private List<String> attendanceClearOrNot;
//
//    public FilterDTO_V2(Map filterMap) {
//        Gson gson = CommonFunction.getGson();
//        Type typeOfMap = new TypeToken<FilterDTO_V2>() {
//        }.getType();
//        FilterDTO_V2 filterDTO_v2 = new FilterDTO_V2();
//        try {
//            if (Objects.nonNull(filterMap)) {
//                String json = gson.toJson(filterMap);
//                filterDTO_v2 = gson.fromJson(json, typeOfMap);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        this.sbu = filterDTO_v2.getSbu();
//        this.state = filterDTO_v2.getState();
//        this.branch = filterDTO_v2.getBranch();
//        this.department = filterDTO_v2.getDepartment();
//        this.category = filterDTO_v2.getCategory();
//        this.subCategory = filterDTO_v2.getSubCategory();
//        this.payCadre = filterDTO_v2.getPayCadre();
//        this.employee = filterDTO_v2.getEmployee();
//        this.employeeType = filterDTO_v2.getEmployeeType();
//        this.employmentType = filterDTO_v2.getEmploymentType();
//        this.employeeStatusObject = filterDTO_v2.getEmployeeStatusObject();
//        this.employeeStatus = filterDTO_v2.getEmployeeStatus();
//        this.grade = filterDTO_v2.getGrade();
//        this.designation = filterDTO_v2.getDesignation();
//    }
//}
//
