"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import img1 from '../assets/img1.png'
import { type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { clsx } from "clsx"
import Navbar from "./Navbar"
import type { PersonDetails, FormData, PendingRegistration, ApiResponse } from '../utilities/types'
import { API_URL } from "../services/api"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "border-gray-300 bg-white placeholder:text-gray-400 focus-visible:ring-blue-500 ring-offset-white",
        props.readOnly && "bg-gray-100 cursor-not-allowed",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export default function OnboardingForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    shortName: "",
    gstNumber: "",
    pincode: "",
    address: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    designation: "OWNER",
    customDesignation: "",
    ownerDetails: null,
    hrDetails: null,
  })

  const [loading, setLoading] = useState(false)
  const [showOtpPopup, setShowOtpPopup] = useState(false)
  const [registrationToken, setRegistrationToken] = useState<string | null>(null)
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [otpLoading, setOtpLoading] = useState(false)
  const [pendingRegistration, setPendingRegistration] = useState<PendingRegistration | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Pre-fill Owner or HR details when designation is "Owner" or "HR"
  useEffect(() => {
    const personDetails = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.mobile,
    }

    if (formData.designation === "OWNER") {
      setFormData((prev) => ({
        ...prev,
        ownerDetails: personDetails,
        hrDetails: null,
        customDesignation: "",
      }))
    } else if (formData.designation === "HR") {
      setFormData((prev) => ({
        ...prev,
        hrDetails: personDetails,
        ownerDetails: null,
        customDesignation: "",
      }))
    } else if (formData.designation === "OTHER") {
      setFormData((prev) => ({
        ...prev,
        ownerDetails: prev.ownerDetails || {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        },
        hrDetails: prev.hrDetails || {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        },
      }))
    }
  }, [formData.firstName, formData.lastName, formData.email, formData.mobile, formData.designation])

  // Fetch PendingRegistration when the popup is shown
  // useEffect(() => {
  //   if (showOtpPopup && registrationToken) {
  //     const fetchPendingRegistration = async () => {
  //       try {
  //         console.log(`Fetching pending registration with token: ${registrationToken}`)
  //         console.log(`API URL: ${API_URL}/companies/pending-registration/${registrationToken}`)
  //         const response = await fetch(`${API_URL}/company/pending-registration/${registrationToken}`, {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         })
  //         if (!response.ok) {
  //           throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`)
  //         }
  //         const result: ApiResponse = await response.json()
  //         console.log("Pending registration response:", result)
  //         if (result.error) {
  //           throw new Error(result.message || "Failed to fetch pending registration")
  //         }
  //         setPendingRegistration(result.data as PendingRegistration)
  //         setFetchError(null)
  //       } catch (err: any) {
  //         console.error("Error fetching pending registration:", err)
  //         setFetchError(err.message || "Failed to load registration data")
  //         toast.warn("Unable to load registration details. Please enter the OTP you received via email.")
  //         // Do not close the popup; let the user enter the OTP manually
  //       }
  //     }
  //     fetchPendingRegistration()
  //   }
  // }, [showOtpPopup, registrationToken])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    nestedField?: "ownerDetails" | "hrDetails",
    subField?: keyof PersonDetails
  ) => {
    const { name, value } = e.target

    if (nestedField && subField) {
      setFormData((prev) => ({
        ...prev,
        [nestedField]: {
          ...prev[nestedField]!,
          [subField]: value,
        },
      }))
    } else if (name === "designation" || name === "customDesignation") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.toUpperCase(), // Convert to uppercase
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation logic
    if (formData.gstNumber && formData.gstNumber.length !== 15) {
      toast.error("GST number should be exactly 15 characters")
      setLoading(false)
      return
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      toast.error("Pincode should be 6 digits")
      setLoading(false)
      return
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      toast.error("Please enter a valid email address for the user")
      setLoading(false)
      return
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error("User mobile number should be 10 digits")
      setLoading(false)
      return
    }
    if (formData.designation === "OTHER") {
      if (!formData.customDesignation) {
        toast.error("Custom designation is required when 'Other' is selected")
        setLoading(false)
        return
      }
      if (
        !formData.ownerDetails?.firstName ||
        !formData.ownerDetails?.lastName ||
        !formData.ownerDetails?.email ||
        !formData.ownerDetails?.phone
      ) {
        toast.error("All owner details are required when designation is 'Other'")
        setLoading(false)
        return
      }
      if (
        !formData.hrDetails?.firstName ||
        !formData.hrDetails?.lastName ||
        !formData.hrDetails?.email ||
        !formData.hrDetails?.phone
      ) {
        toast.error("All HR details are required when designation is 'Other'")
        setLoading(false)
        return
      }
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.ownerDetails.email)) {
        toast.error("Please enter a valid email address for the owner")
        setLoading(false)
        return
      }
      if (!/^\d{10}$/.test(formData.ownerDetails.phone)) {
        toast.error("Owner mobile number should be 10 digits")
        setLoading(false)
        return
      }
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.hrDetails.email)) {
        toast.error("Please enter a valid email address for the HR")
        setLoading(false)
        return
      }
      if (!/^\d{10}$/.test(formData.hrDetails.phone)) {
        toast.error("HR mobile number should be 10 digits")
        setLoading(false)
        return
      }
    }

    // Map formData to backend DTO structure
    const payload = {
      companyName: formData.companyName,
      shortName: formData.shortName,
      gstRegistrationNumber: formData.gstNumber,
      pincode: formData.pincode,
      address: formData.address,
      numberOfEmployees: 1, // Default value since not collected in the form
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.mobile,
      designation: formData.designation.toUpperCase(),
      customDesignation: formData.designation === "OTHER" ? formData.customDesignation.toUpperCase() : undefined,
      ownerDetails: formData.ownerDetails,
      hrDetails: formData.hrDetails,
    }

    try {
      const response = await fetch(`${API_URL}/company/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const result: ApiResponse = await response.json()
      if (result.error) {
        toast.error(result.message || "An error occurred")
      } else {
        setRegistrationToken(result.data as string || null)
        setShowOtpPopup(true)
        toast.info("Please check your email for the OTP")
      }
    } catch (err: any) {
      toast.error("Failed to initiate registration. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!registrationToken) {
      toast.error("Registration token is missing")
      return
    }

    // Basic validation for password
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setOtpLoading(true)

    try {
      const response = await fetch(`${API_URL}/company/complete-registration/${registrationToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, password }),
      })
      const result: ApiResponse = await response.json()
      if (result.error) {
        toast.error(result.message || "Failed to verify OTP")
      } else {
        toast.success("Company registered successfully!")
        setShowOtpPopup(false)
        navigate("/home")
      }
    } catch (err: any) {
      console.log(err.mee);
      toast.error("Failed to complete registration. Please try again.")
    } finally {
      setOtpLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      companyName: "",
      shortName: "",
      gstNumber: "",
      pincode: "",
      address: "",
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      designation: "",
      customDesignation: "",
      ownerDetails: null,
      hrDetails: null,
    })
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={showOtpPopup ? "transition-all duration-300 ease-in-out filter blur-sm" : ""}>
          <p className="text-gray-700 mb-8 text-base">Just a few details to kick off your Onboarding journey —</p>
          <form onSubmit={handleSubmit}>
            {/* Basic Details Section */}
            <div className="bg-white border border-gray-200 rounded-lg mb-8">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Basic Details</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                  <div className="lg:col-span-1">
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <label htmlFor="shortName" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Short Name
                    </label>
                    <Input
                      id="shortName"
                      name="shortName"
                      value={formData.shortName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      GST Registration Number
                    </label>
                    <Input id="gstNumber" name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-x-6 gap-y-4 mt-4">
                  <div className="lg:col-span-1 md:col-span-1">
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} required />
                  </div>
                  <div className="lg:col-span-2 md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                  </div>
                </div>
              </div>
            </div>

            {/* User Details Section */}
            <div className="bg-white border border-gray-200 rounded-lg mb-8">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Your Details</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="OWNER">Owner</option>
                      <option value="HR">HR</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  {formData.designation === "OTHER" && (
                    <div>
                      <label htmlFor="customDesignation" className="block text-sm font-medium text-gray-700 mb-1">
                        Custom Designation <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="customDesignation"
                        name="customDesignation"
                        value={formData.customDesignation}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Owner Details Section (shown for "Owner" or "Other") */}
            {(formData.designation === "OWNER" || formData.designation === "OTHER") && (
              <div className="bg-white border border-gray-200 rounded-lg mb-8">
                <div className="p-5 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Owner Details</h2>
                  {formData.designation === "OWNER" && (
                    <p className="text-sm text-gray-500 mt-1">
                      These details are read-only. Edit your details in the "Your Details" section above.
                    </p>
                  )}
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                    <div>
                      <label
                        htmlFor="ownerDetails.firstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Owner First Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="ownerDetails.firstName"
                        name="ownerDetails.firstName"
                        value={formData.ownerDetails?.firstName || ""}
                        onChange={(e) => handleChange(e, "ownerDetails", "firstName")}
                        required
                        readOnly={formData.designation === "OWNER"}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ownerDetails.lastName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Owner Last Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="ownerDetails.lastName"
                        name="ownerDetails.lastName"
                        value={formData.ownerDetails?.lastName || ""}
                        onChange={(e) => handleChange(e, "ownerDetails", "lastName")}
                        required
                        readOnly={formData.designation === "OWNER"}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ownerDetails.email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Owner Mail ID <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="ownerDetails.email"
                        name="ownerDetails.email"
                        type="email"
                        value={formData.ownerDetails?.email || ""}
                        onChange={(e) => handleChange(e, "ownerDetails", "email")}
                        required
                        readOnly={formData.designation === "OWNER"}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ownerDetails.phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Owner Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="ownerDetails.phone"
                        name="ownerDetails.phone"
                        type="tel"
                        value={formData.ownerDetails?.phone || ""}
                        onChange={(e) => handleChange(e, "ownerDetails", "phone")}
                        required
                        readOnly={formData.designation === "OWNER"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HR Details Section (shown for "HR" or "Other") */}
            {(formData.designation === "HR" || formData.designation === "OTHER") && (
              <div className="bg-white border border-gray-200 rounded-lg mb-8">
                <div className="p-5 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">HR Details</h2>
                  {formData.designation === "HR" && (
                    <p className="text-sm text-gray-500 mt-1">
                      These details are read-only. Edit your details in the "Your Details" section above.
                    </p>
                  )}
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                    <div>
                      <label htmlFor="hrDetails.firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        HR First Name{" "}
                        <span className="text-red-500">{formData.designation === "OTHER" ? "*" : ""}</span>
                      </label>
                      <Input
                        id="hrDetails.firstName"
                        name="hrDetails.firstName"
                        value={formData.hrDetails?.firstName || ""}
                        onChange={(e) => handleChange(e, "hrDetails", "firstName")}
                        required={formData.designation === "OTHER"}
                        readOnly={formData.designation === "HR"}
                      />
                    </div>
                    <div>
                      <label htmlFor="hrDetails.lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        HR Last Name{" "}
                        <span className="text-red-500">{formData.designation === "OTHER" ? "*" : ""}</span>
                      </label>
                      <Input
                        id="hrDetails.lastName"
                        name="hrDetails.lastName"
                        value={formData.hrDetails?.lastName || ""}
                        onChange={(e) => handleChange(e, "hrDetails", "lastName")}
                        required={formData.designation === "OTHER"}
                        readOnly={formData.designation === "HR"}
                      />
                    </div>
                    <div>
                      <label htmlFor="hrDetails.email" className="block text-sm font-medium text-gray-700 mb-1">
                        HR Mail ID{" "}
                        <span className="text-red-500">{formData.designation === "OTHER" ? "*" : ""}</span>
                      </label>
                      <Input
                        id="hrDetails.email"
                        name="hrDetails.email"
                        type="email"
                        value={formData.hrDetails?.email || ""}
                        onChange={(e) => handleChange(e, "hrDetails", "email")}
                        required={formData.designation === "OTHER"}
                        readOnly={formData.designation === "HR"}
                      />
                    </div>
                    <div>
                      <label htmlFor="hrDetails.phone" className="block text-sm font-medium text-gray-700 mb-1">
                        HR Mobile Number{" "}
                        <span className="text-red-500">{formData.designation === "OTHER" ? "*" : ""}</span>
                      </label>
                      <Input
                        id="hrDetails.phone"
                        name="hrDetails.phone"
                        type="tel"
                        value={formData.hrDetails?.phone || ""}
                        onChange={(e) => handleChange(e, "hrDetails", "phone")}
                        required={formData.designation === "OTHER"}
                        readOnly={formData.designation === "HR"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                className="px-5 py-2.5 rounded-md bg-red-500 text-white hover:bg-gray-300 font-medium text-sm transition-colors"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div>Submit</div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* OTP and Password Popup */}
      {showOtpPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Verify OTP and Set Password</h2>
            </div>
            <div className="p-5">
              {fetchError && (
                <p className="text-yellow-600 mb-4">{fetchError}</p>
              )}
              {pendingRegistration ? (
                <p className="text-gray-600 mb-6">
                  An OTP has been sent to {pendingRegistration.registrationDTO.email}. Please enter the OTP and set your password.
                </p>
              ) : (
                <p className="text-gray-600 mb-6">Please enter the OTP you received via email and set your password.</p>
              )}
              <form onSubmit={handleOtpSubmit}>
                <div className="mb-4">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    OTP <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="Enter 6-digit OTP"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtpPopup(false)
                      setRegistrationToken(null)
                      setOtp("")
                      setPassword("")
                      setPendingRegistration(null)
                      setFetchError(null)
                    }}
                    className="px-5 py-2.5 rounded-md bg-red-500 text-white hover:bg-gray-300 font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={otpLoading}
                    className="px-5 py-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {otpLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div>Verify and Register</div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}