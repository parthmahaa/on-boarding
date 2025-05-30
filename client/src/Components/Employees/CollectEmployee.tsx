import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { EmployeeFormData } from '../../utilities/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { API_URL } from '../../services/api';

// Helper to format date as DD-MMM-YYYY
function formatDate(date: Date | null): string {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Map API value to UI value for salaryOn
const salaryOnApiToUi: Record<string, string> = {
    'Monthly': 'Month',
    'Day': 'Day',
    'Hourly': 'Hourly',
    'DWages': 'DWages',
    'Stipend': 'Stipend',
    'Day-HO': 'Day-HO',
    'WorkingDay': 'WorkingDay',
    'Month': 'Month'
};
const salaryOnUiToApi: Record<string, string> = {
    'Month': 'Monthly',
    'Day': 'Day',
    'Hourly': 'Hourly',
    'DWages': 'DWages',
    'Stipend': 'Stipend',
    'Day-HO': 'Day-HO',
    'WorkingDay': 'WorkingDay'
};

// Accept initial form data as a prop or from somewhere else if needed
// For demonstration, let's use a prop (you can adjust as needed)
type AddEmployeeFormProps = {
    initialData?: Partial<EmployeeFormData>
};

const CollectEmployee: React.FC<AddEmployeeFormProps> = ({ initialData }) => {
    const { companyId } = useParams<{ companyId: string }>();

    // State for form fields
    const [formData, setFormData] = useState<EmployeeFormData>({
        id: '',
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfJoining: '',
        dateOfBirth: '',
        actualDateOfBirth: '',
        gender: '',
        sbu: initialData?.sbu || '',
        department: initialData?.department || '',
        subDepartment: '', // <-- keep for type compatibility, but will not use in UI or logic
        branch: '',
        complianceBranch: '',
        designation: '',
        grade: '',
        employeeType: '',
        employmentType: '',
        probationStatus: '',
        salaryOn: initialData?.salaryOn ? (salaryOnApiToUi[initialData.salaryOn] || initialData.salaryOn) : '',
        officialEmail: '',
        probationEndDate: '',
        appraisalDate: '',
        countOffDayInAttendance: false,
        countHolidayInAttendance: false,
        primaryManagerId: '',
        secondaryManagerId: '',
        paymentMethod: '',
        aadharNo: '',
        panNo: '',
        companyId: companyId || '',
        companyName: '',
        ...initialData,
    });

    // State for dependent dropdown options
    // Remove subDepartments state
    // const [subDepartments, setSubDepartments] = useState<string[]>([]);
    const [complianceBranches, setComplianceBranches] = useState<string[]>([]);
    const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);

    // State for date pickers
    const [dateOfJoiningPicker, setDateOfJoiningPicker] = useState<Date | null>(null);
    const [dateOfBirthPicker, setDateOfBirthPicker] = useState<Date | null>(null);
    const [actualDateOfBirthPicker, setActualDateOfBirthPicker] = useState<Date | null>(null);
    const [probationEndDatePicker, setProbationEndDatePicker] = useState<Date | null>(null);
    const [appraisalDatePicker, setAppraisalDatePicker] = useState<Date | null>(null);

    // Predefined values
    const departments = ['HR', 'IT', 'Finance & Accounting','Sales' ,'Marketing', 'Management', 'Operations' ,'Customer Support/ Service' ,'Legal' ,'Product / R&D' , 'Administration/Facilities','Excecutive Management', 'Procurement/Purchasing'];
    const sbuOptions = ['SBU1', 'SBU2'];
    const grades = ['G1', 'G2', 'G3', 'G4'];
    const branches = ['HQ', 'Branch A', 'Branch B'];
    const complianceBranchMap = {
        'HQ': ['HQ Compliance'],
        'Branch A': ['Branch A Compliance'],
        'Branch B': ['Branch B Compliance']
    };
    const employeeTypeOptions = ['FULL_TIME', 'PART_TIME', 'CONTRACT'];
    const employmentTypeMap = {
        FULL_TIME: ['PERMANENT', 'PROBATION'],
        PART_TIME: ['TEMPORARY'],
        CONTRACT: ['FIXED_TERM']
    };
    const employmentTypeOptions = ['PERMANENT', 'PROBATION', 'TEMPORARY', 'FIXED_TERM'];
    const probationStatuses = ['ON_PROBATION', 'COMPLETED', 'EXTENDED'];
    const managers = ['MGR001', 'MGR002', 'MGR003'];
    const genders = ['MALE', 'FEMALE', 'OTHER'];

    // Add salary type options
    const salaryOnOptions = [
        'Day',
        'Hourly',
        'Month',
        'DWages',
        'Stipend',
        'Day-HO',
        'WorkingDay'
    ];

    useEffect(() => {
        // Sync pickers with formData (for reset)
        setDateOfJoiningPicker(formData.dateOfJoining ? new Date(formData.dateOfJoining) : null);
        setDateOfBirthPicker(formData.dateOfBirth ? new Date(formData.dateOfBirth) : null);
        setActualDateOfBirthPicker(formData.actualDateOfBirth ? new Date(formData.actualDateOfBirth) : null);
        setProbationEndDatePicker(formData.probationEndDate ? new Date(formData.probationEndDate) : null);
        setAppraisalDatePicker(formData.appraisalDate ? new Date(formData.appraisalDate) : null);
    // eslint-disable-next-line
    }, []);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox'
                ? (e.target instanceof HTMLInputElement ? e.target.checked : prev[name as keyof EmployeeFormData])
                : value
        }));
    };

    // Update complianceBranch options when branch changes
    useEffect(() => {
        if (formData.branch) {
            setComplianceBranches(complianceBranchMap[formData.branch as keyof typeof complianceBranchMap] || []);
            setFormData((prev) => ({ ...prev, complianceBranch: complianceBranchMap[formData.branch as keyof typeof complianceBranchMap]?.[0] || '' }));
        } else {
            setComplianceBranches([]);
        }
    }, [formData.branch]);

    // Update employmentType options when employeeType changes
    useEffect(() => {
        if (formData.employeeType) {
            setEmploymentTypes(employmentTypeMap[formData.employeeType as keyof typeof employmentTypeMap] || []);
            setFormData((prev) => ({ ...prev, employmentType: '' }));
        } else {
            setEmploymentTypes([]);
        }
    }, [formData.employeeType]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Ensure all date fields are formatted
        const dataToSend = {
            ...formData,
            sbu: formData.sbu,
            department: formData.department,
            salaryOn: salaryOnUiToApi[formData.salaryOn] || formData.salaryOn,
            dateOfJoining: formatDate(dateOfJoiningPicker),
            dateOfBirth: formatDate(dateOfBirthPicker),
            actualDateOfBirth: formatDate(actualDateOfBirthPicker),
            probationEndDate: formatDate(probationEndDatePicker),
            appraisalDate: formatDate(appraisalDatePicker),
        };
        try {
            console.log(dataToSend);
            const response = await fetch(`${API_URL}/employees/addEmployee`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });
            const result = await response.json();
            if (response.ok) {
                toast.success('Employee added successfully!');
                setFormData({
                    id: '',
                    firstName: '',
                    lastName: '',
                    middleName: '',
                    dateOfJoining: '',
                    dateOfBirth: '',
                    actualDateOfBirth: '',
                    gender: '',
                    sbu: '',
                    department: '', // <-- Add this line
                    subDepartment: '',
                    branch: '',
                    complianceBranch: '',
                    designation: '',
                    grade: '',
                    employeeType: '',
                    employmentType: '',
                    probationStatus: '',
                    salaryOn: '',
                    officialEmail: '',
                    probationEndDate: '',
                    appraisalDate: '',
                    countOffDayInAttendance: false,
                    countHolidayInAttendance: false,
                    primaryManagerId: '',
                    secondaryManagerId: '',
                    paymentMethod: '',
                    aadharNo: '',
                    panNo: '',
                    companyId: formData.companyId ,
                    companyName: formData.companyName,
                });
                setDateOfJoiningPicker(null);
                setDateOfBirthPicker(null);
                setActualDateOfBirthPicker(null);
                setProbationEndDatePicker(null);
                setAppraisalDatePicker(null);
            } else {
                alert('Error: ' + result.message);
            }
        } catch (err : any) {
            toast.error('Error submitting form: ');
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-red-500 text-left">{formData.companyName}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Employee ID (Optional)</label>
                    <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        // placeholder="EMP001"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name *</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                        <input
                            type="text"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Joining (DD-MMM-YYYY) *</label>
                        <DatePicker
                            selected={dateOfJoiningPicker}
                            onChange={(date) => {
                                setDateOfJoiningPicker(date);
                                setFormData(prev => ({
                                    ...prev,
                                    dateOfJoining: formatDate(date)
                                }));
                            }}
                            dateFormat="dd-MMM-yyyy"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth (DD-MMM-YYYY) *</label>
                        <DatePicker
                            selected={dateOfBirthPicker}
                            onChange={(date) => {
                                setDateOfBirthPicker(date);
                                setFormData(prev => ({
                                    ...prev,
                                    dateOfBirth: formatDate(date)
                                }));
                            }}
                            dateFormat="dd-MMM-yyyy"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Actual Date of Birth (DD-MMM-YYYY)</label>
                        <DatePicker
                            selected={actualDateOfBirthPicker}
                            onChange={(date) => {
                                setActualDateOfBirthPicker(date);
                                setFormData(prev => ({
                                    ...prev,
                                    actualDateOfBirth: formatDate(date)
                                }));
                            }}
                            dateFormat="dd-MMM-yyyy"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender *</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="">Select Gender</option>
                        {genders.map((gender) => (
                            <option key={gender} value={gender}>{gender}</option>
                        ))}
                    </select>
                </div>

                {/* Department and SBU Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Department *</label>
                        <select
                            name="department"
                            value={formData.department || ''}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">SBU *</label>
                        <select
                            name="sbu"
                            value={formData.sbu || ''}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select SBU</option>
                            {sbuOptions.map((sbu) => (
                                <option key={sbu} value={sbu}>{sbu}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* Sub Department as optional free-text input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Sub Department (Optional)</label>
                    <input
                        type="text"
                        name="subDepartment"
                        value={formData.subDepartment}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        placeholder=""
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Branch *</label>
                        <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select Branch</option>
                            {branches.map((branch) => (
                                <option key={branch} value={branch}>{branch}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Compliance Branch *</label>
                        <select
                            name="complianceBranch"
                            value={formData.complianceBranch}
                            onChange={handleChange}
                            disabled={!formData.branch}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select Compliance Branch</option>
                            {complianceBranches.map((compBranch) => (
                                <option key={compBranch} value={compBranch}>{compBranch}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Designation *</label>
                        <input
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Grade *</label>
                        <select
                            name="grade"
                            value={formData.grade}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select Grade</option>
                            {grades.map((grade) => (
                                <option key={grade} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Employment Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Employee Type *</label>
                        <select
                            name="employeeType"
                            value={formData.employeeType}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select Employee Type</option>
                            {employeeTypeOptions.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Employment Type *</label>
                        <select
                            name="employmentType"
                            value={formData.employmentType}
                            onChange={handleChange}
                            disabled={!formData.employeeType}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select Employment Type</option>
                            {employmentTypeOptions.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Probation Status *</label>
                    <select
                        name="probationStatus"
                        value={formData.probationStatus}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="">Select Probation Status</option>
                        {probationStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Probation End Date (DD-MMM-YYYY)</label>
                        <DatePicker
                            selected={probationEndDatePicker}
                            onChange={(date) => {
                                setProbationEndDatePicker(date);
                                setFormData(prev => ({
                                    ...prev,
                                    probationEndDate: formatDate(date)
                                }));
                            }}
                            dateFormat="dd-MMM-yyyy"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Appraisal Date (DD-MMM-YYYY)</label>
                        <DatePicker
                            selected={appraisalDatePicker}
                            onChange={(date) => {
                                setAppraisalDatePicker(date);
                                setFormData(prev => ({
                                    ...prev,
                                    appraisalDate: formatDate(date)
                                }));
                            }}
                            dateFormat="dd-MMM-yyyy"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Salary Type *</label>
                        <select
                            name="salaryOn"
                            value={formData.salaryOn}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select Salary Type</option>
                            {salaryOnOptions.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Manager Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Primary Manager</label>
                        <select
                            name="primaryManagerId"
                            value={formData.primaryManagerId}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select Primary Manager</option>
                            {managers.map((manager) => (
                                <option key={manager} value={manager}>{manager}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Secondary Manager</label>
                        <select
                            name="secondaryManagerId"
                            value={formData.secondaryManagerId}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select Secondary Manager</option>
                            {managers.map((manager) => (
                                <option key={manager} value={manager}>{manager}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Additional Information */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Official Email</label>
                    <input
                        type="email"
                        name="officialEmail"
                        value={formData.officialEmail}
                        onChange={handleChange}
                        // placeholder="e.g., john.doe@company.com"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="countOffDayInAttendance"
                                checked={formData.countOffDayInAttendance}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Count Off Day in Attendance</span>
                        </label>
                    </div>
                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="countHolidayInAttendance"
                                checked={formData.countHolidayInAttendance}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Count Holiday in Attendance</span>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Aadhar No</label>
                        <input
                            type="text"
                            name="aadharNo"
                            value={formData.aadharNo}
                            onChange={handleChange}
                            // placeholder="12 digits"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">PAN No</label>
                        <input
                            type="text"
                            name="panNo"
                            value={formData.panNo}
                            onChange={handleChange}
                            // placeholder="e.g., ABCDE1234F"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <input
                        type="text"
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        // placeholder="e.g., BANK_TRANSFER"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                    >
                        Add Employee
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CollectEmployee;