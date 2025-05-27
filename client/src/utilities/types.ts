export type PersonDetails = {
  firstName: string
  lastName: string
  email: string
  phone: string
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