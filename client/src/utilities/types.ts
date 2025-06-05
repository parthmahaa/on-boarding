export type PersonDetails = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface Rule {
  id: number;
  condition: 'include' | 'exclude';
  field: string;
  operator: '==' | '!=';
  value: string[];
}

export interface Task {
  id: number;
  text: string;
}

export type Company = {
  id: string;
  companyName: string;
  shortName: string;
  gstRegistrationNumber: string;
  pincode: string;
  address: string;
  noOfEmployees: number;
  companyStatus: string;
  employees: null | any[];
};

export type ApiResponse = {
  time?: string;
  status?: number;
  message: string;
  data?: any;
  error?: boolean;
};

export interface RegistrationDTO {
  companyName: string
  shortName: string
  gstRegistrationNumber: string
  pincode: string
  address: string
  numberOfEmployees: number
  firstName: string
  lastName: string
  email: string
  phone: string
  designation: string
  customDesignation?: string
  ownerDetails: PersonDetails | null
  hrDetails: PersonDetails | null
}

export type FormData = {
  companyName: string
  shortName: string
  gstNumber: string
  pincode: string
  address: string
  firstName: string
  lastName: string
  email: string
  mobile: string
  designation: string
  customDesignation: string
  ownerDetails: PersonDetails | null
  hrDetails: PersonDetails | null
  numberOfEmployees : Number | string
}

export interface PendingRegistration {
  registrationDTO: RegistrationDTO
  otp: string
  otpExpiry: string
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  branch : string;
  roles: string[];
  status? : String
}

// Add this type for employee form data (matches AddEmployee.tsx)
export type EmployeeFormData = {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfJoining: string;
    dateOfBirth: string;
    actualDateOfBirth: string;
    gender: string;
    sbu: string;
    department: string; // <-- Add this line
    subDepartment: string;
    branch: string;
    complianceBranch: string;
    designation: string;
    grade: string;
    employeeType: string;
    employmentType: string;
    probationStatus: string;
    salaryOn: string; // <-- Add this line
    officialEmail: string;
    probationEndDate: string;
    appraisalDate: string;
    countOffDayInAttendance: boolean;
    countHolidayInAttendance: boolean;
    primaryManagerId: string;
    secondaryManagerId: string;
    paymentMethod: string;
    aadharNo: string;
    panNo: string;
    companyId: string;
    companyName: string;
};
