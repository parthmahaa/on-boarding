"use client"

import React from "react"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import img1 from '../assets/img1.png'
import { type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { clsx } from "clsx"

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

type PersonDetails = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

type FormData = {
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

export default function OnboardingForm() {
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
    designation: "Owner",
    customDesignation: "",
    ownerDetails: null,
    hrDetails: null,
  })

  const [showContact, setShowContact] = useState(false);

  // Pre-fill Owner or HR details when designation is "Owner" or "HR"
  useEffect(() => {
    const personDetails = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.mobile,
    }

    if (formData.designation === "Owner") {
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
    } else if (formData.designation === "Admin") {
      setFormData((prev) => ({
        ...prev,
        ownerDetails: null,
        hrDetails: null,
        customDesignation: "",
      }))
    } else if (formData.designation === "Other") {
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
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation logic
    if (formData.gstNumber && formData.gstNumber.length !== 15) {
      toast.error("GST number should be exactly 15 characters")
      return
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      toast.error("Pincode should be 6 digits")
      return
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      toast.error("Please enter a valid email address for the user")
      return
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error("User mobile number should be 10 digits")
      return
    }
    if (formData.designation === "Other") {
      if (!formData.customDesignation) {
        toast.error("Custom designation is required when 'Other' is selected")
        return
      }
      if (
        !formData.ownerDetails?.firstName ||
        !formData.ownerDetails?.lastName ||
        !formData.ownerDetails?.email ||
        !formData.ownerDetails?.phone
      ) {
        toast.error("All owner details are required when designation is 'Other'")
        return
      }
      if (
        !formData.hrDetails?.firstName ||
        !formData.hrDetails?.lastName ||
        !formData.hrDetails?.email ||
        !formData.hrDetails?.phone
      ) {
        toast.error("All HR details are required when designation is 'Other'")
        return
      }
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.ownerDetails.email)) {
        toast.error("Please enter a valid email address for the owner")
        return
      }
      if (!/^\d{10}$/.test(formData.ownerDetails.phone)) {
        toast.error("Owner mobile number should be 10 digits")
        return
      }
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.hrDetails.email)) {
        toast.error("Please enter a valid email address for the HR")
        return
      }
      if (!/^\d{10}$/.test(formData.hrDetails.phone)) {
        toast.error("HR mobile number should be 10 digits")
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
      designation: formData.designation,
      customDesignation: formData.designation === "Other" ? formData.customDesignation.toUpperCase() : undefined,
      ownerDetails: formData.ownerDetails,
      hrDetails: formData.hrDetails,
    }

    try {
      const response = await fetch("http://localhost:8080/api/company/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (result.error) {
        toast.error(result.message || "An error occurred")
      } else {
        toast.success(
          "Company Added"
        )
      }
    } catch (err: any) {
      toast.error("Failed to submit form. Please try again.")
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
      designation: "Owner",
      customDesignation: "",
      ownerDetails: null,
      hrDetails: null,
    })
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-col sm:flex-row items-center mb-10">
          <div className="mr-4 mb-4 sm:mb-0">
            <img src={img1} alt="Emgage" width={100} height={75} />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Emgage !</h1>
            <p className="text-base text-gray-600 mt-1">
              your all-in-one HRMS to simplify, streamline, and supercharge your people operation
            </p>
          </div>
          <div className="ml-0 sm:ml-auto flex items-center mt-4 sm:mt-0 relative">
            <button
              className="p-1.5 mr-3 text-gray-500 hover:text-gray-700"
              aria-label="Help"
              type="button"
              onClick={() => setShowContact((v) => !v)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </button>
            {showContact && (
              <div className="absolute right-0 top-10 z-50 bg-white border border-gray-200 rounded shadow-lg p-4 w-64 text-sm">
                <div className="font-semibold mb-2">Contact Support</div>
                <div>
                  <div>
                    <span className="font-medium">Phone:</span> +91-9876543210
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    <a href="mailto:support@emgage.in" className="text-blue-600 underline">
                      support@emgage.in
                    </a>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center">
              <img src={img1} alt="Emgage" width={30} height={30} />
              <span className="ml-2 text-gray-700 font-medium text-sm">Emgage pvt ltd</span>
            </div>
          </div>
        </header>

        <div className="mt-8">
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
                      <option value="Owner">Owner</option>
                      <option value="HR">HR</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {formData.designation === "Other" && (
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
            {(formData.designation === "Owner" || formData.designation === "Other") && (
              <div className="bg-white border border-gray-200 rounded-lg mb-8">
                <div className="p-5 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Owner Details</h2>
                  {formData.designation === "Owner" && (
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
                        readOnly={formData.designation === "Owner"}
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
                        readOnly={formData.designation === "Owner"}
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
                        readOnly={formData.designation === "Owner"}
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
                        readOnly={formData.designation === "Owner"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HR Details Section (shown for "HR" or "Other") */}
            {(formData.designation === "HR" || formData.designation === "Other") && (
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
                        <span className="text-red-500">{formData.designation === "Other" ? "*" : ""}</span>
                      </label>
                      <Input
                        id="hrDetails.firstName"
                        name="hrDetails.firstName"
                        value={formData.hrDetails?.firstName || ""}
                        onChange={(e) => handleChange(e, "hrDetails", "firstName")}
                        required={formData.designation === "Other"}
                        readOnly={formData.designation === "HR"}
                      />
                    </div>
                    <div>
                      <label htmlFor="hrDetails.lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        HR Last Name{" "}
                        <span className="text-red-500">{formData.designation === "Other" ? "*" : ""}</span>
                      </label>
                      <Input
                        id="hrDetails.lastName"
                        name="hrDetails.lastName"
                        value={formData.hrDetails?.lastName || ""}
                        onChange={(e) => handleChange(e, "hrDetails", "lastName")}
                        required={formData.designation === "Other"}
                        readOnly={formData.designation === "HR"}
                      />
                    </div>
                    <div>
                      <label htmlFor="hrDetails.email" className="block text-sm font-medium text-gray-700 mb-1">
                        HR Mail ID{" "}
                        <span className="text-red-500">{formData.designation === "Other" ? "*" : ""}</span>
                      </label>
                      <Input
                        id="hrDetails.email"
                        name="hrDetails.email"
                        type="email"
                        value={formData.hrDetails?.email || ""}
                        onChange={(e) => handleChange(e, "hrDetails", "email")}
                        required={formData.designation === "Other"}
                        readOnly={formData.designation === "HR"}
                      />
                    </div>
                    <div>
                      <label htmlFor="hrDetails.phone" className="block text-sm font-medium text-gray-700 mb-1">
                        HR Mobile Number{" "}
                        <span className="text-red-500">{formData.designation === "Other" ? "*" : ""}</span>
                      </label>
                      <Input
                        id="hrDetails.phone"
                        name="hrDetails.phone"
                        type="tel"
                        value={formData.hrDetails?.phone || ""}
                        onChange={(e) => handleChange(e, "hrDetails", "phone")}
                        required={formData.designation === "Other"}
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
                className="px-5 py-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}