import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { EmployeeFormData } from '../../utilities/types';
import DatePicker from '../ui/DatePicker';
import { API_URL } from '../../services/api';
import { Switch } from '@headlessui/react';

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
    const [companyDetails, setCompanyDetails] = useState<{
        id: string;
        name: string;
        logo?: string;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Add new state variables for API data
    const [apiSbus, setApiSbus] = useState<string[]>([]);
    const [apiBranches, setApiBranches] = useState<string[]>([]);
    const [apiGrades, setApiGrades] = useState<string[]>([]);
    const [apiDepartments, setApiDepartments] = useState<string[]>([]);
    const [apiEmployees, setApiEmployees] = useState<{id: string, name: string}[]>([])

    // Add state for custom input flags
    const [useCustomSbu, setUseCustomSbu] = useState(false);
    const [useCustomBranch, setUseCustomBranch] = useState(false);
    const [useCustomDepartment, setUseCustomDepartment] = useState(false);
    const [useCustomGrade, setUseCustomGrade] = useState(false);

    const [showOptionalDetails, setShowOptionalDetails] = useState(false);

    // First fetch company details using public URL
    useEffect(() => {
        const fetchCompanyDetails = async () => {
            setIsLoading(true);
            try {
                const pathUrl = window.location.pathname;
                const publicUrlParam = pathUrl.split('/c/')[1];
                
                if (!publicUrlParam) {
                    throw new Error('Public URL not found');
                }

                const response = await fetch(`${API_URL}/${publicUrlParam}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch company details');
                }

                const data = await response.json();
                if (!data.data) {
                    throw new Error('Invalid company data');
                }

                setCompanyDetails({
                    id: data.data.companyId,
                    name: data.data.companyName,
                    logo: data.data.logo
                });

                // Update form data with company details
                setFormData(prev => ({
                    ...prev,
                    companyId: data.data.companyId,
                    companyName: data.data.companyName
                }));

            } catch (error) {
                console.error('Error fetching company details:', error);
                toast.error('Error fetching company details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanyDetails();
    }, []);

    // Modify existing data fetch to depend on company details
    useEffect(() => {
        const fetchData = async () => {
            if (!companyDetails?.id) return;

            console.log(companyDetails);
            
            try {
                const [
                    employees,
                    sbusRes,
                    branchesRes,
                    gradesRes,
                    departmentsRes,
                ] = await Promise.all([
                    fetch(`${API_URL}/employees/names/${companyDetails.id}`).then(res => res.json()),
                    fetch(`${API_URL}/sbu/${companyDetails.id}`).then(res => res.json()),
                    fetch(`${API_URL}/branch/${companyDetails.id}`).then(res => res.json()),
                    fetch(`${API_URL}/employees/grades/${companyDetails.id}`).then(res => res.json()),
                    fetch(`${API_URL}/employees/departments/${companyDetails.id}`).then(res => res.json()),
                ]);

                setApiEmployees(employees || []);
                setApiSbus(sbusRes.data?.map((s: any) => s.name) || []);
                setApiBranches(branchesRes.data?.map((b: any) => b.branchName) || []);
                setApiGrades(gradesRes || []);
                setApiDepartments(departmentsRes || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error fetching form data');
            }
        };

        fetchData();
    }, [companyDetails]);

    // Define initial form state for resetting the form
    const initialFormState: EmployeeFormData = {
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
        subDepartment: '',
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
        companyId: companyDetails?.id || '',
        companyName: '',
        ...initialData,
    };

    // State for form fields
    const [formData, setFormData] = useState<EmployeeFormData>(initialFormState);
    const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
    // State for date pickers
    const [dateOfJoiningPicker, setDateOfJoiningPicker] = useState<Date | null>(null);
    const [dateOfBirthPicker, setDateOfBirthPicker] = useState<Date | null>(null);
    const [actualDateOfBirthPicker, setActualDateOfBirthPicker] = useState<Date | null>(null);
    const [probationEndDatePicker, setProbationEndDatePicker] = useState<Date | null>(null);
    const [appraisalDatePicker, setAppraisalDatePicker] = useState<Date | null>(null);

    const employeeTypeOptions = ['FULL_TIME', 'PART_TIME'];
    const employmentTypeMap = {
        FULL_TIME: ['PERMANENT', 'PROBATION'],
        PART_TIME: ['TEMPORARY','TRAINEE' , 'FREELANCER' ,'INTERN', 'CONSULTANT'],
    };
    const probationStatuses = ['ON_PROBATION', 'COMPLETED', 'EXTENDED'];
    const genders = ['MALE', 'FEMALE', 'OTHER'];

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
        const dataToSend = {
            ...formData,
            complianceBranch: formData.branch,
            companyId: companyDetails?.id,
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
            const response = await fetch(`${API_URL}/employees/addEmployee`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Employee added successfully!');
                // Reset form
                setFormData(prevState => ({
                    ...initialFormState,
                    companyId: prevState.companyId,
                    companyName: prevState.companyName,
                }));
                // Reset date pickers
                setDateOfJoiningPicker(null);
                setDateOfBirthPicker(null);
                setActualDateOfBirthPicker(null);
                setProbationEndDatePicker(null);
                setAppraisalDatePicker(null);
            } else {
                toast.error(result.message || 'Error adding employee');
            }
        } catch (err) {
            toast.error('Error submitting form');
            console.error('Error:', err);
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!companyDetails) {
        return <div className="flex items-center justify-center h-screen">Company not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-4">
                        {companyDetails?.logo && (
                            <img 
                                src={companyDetails.logo} 
                                alt="Company Logo" 
                                className="h-12 w-auto"
                            />
                        )}
                        <h1 className="text-2xl font-bold text-gray-900">
                            {companyDetails?.name || 'DevX Accelerating Innovation'}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Optional Details</span>
                        <Switch
                            checked={showOptionalDetails}
                            onChange={setShowOptionalDetails}
                            className={`${
                                showOptionalDetails ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        >
                            <span className={`${
                                showOptionalDetails ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                        </Switch>
                    </div>
                </div>

                {/* Subtitle */}
                <h2 className="text-xl text-gray-600 mb-8 text-center">
                    Please fill in your details to help us set you up in the system
                </h2>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
                    {/* Form Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Personal Details Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Details</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Middle Name
                                    </label>
                                    <input
                                        type="text"
                                        name="middleName"
                                        value={formData.middleName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date of Birth (as per document) <span className="text-red-500">*</span>
                                    </label>
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {showOptionalDetails && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date of Birth (Actual)
                                        </label>
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Gender <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="">Select Gender</option>
                                        {genders.map((gender) => (
                                            <option key={gender} value={gender}>{gender}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Employment Details Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Employment Details</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Employee ID
                                    </label>
                                    <input
                                        type="text"
                                        name="id"
                                        value={formData.id}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date of Joining <span className="text-red-500">*</span>
                                    </label>
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        SBU <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        {useCustomSbu ? (
                                            <input
                                                type="text"
                                                name="sbu"
                                                value={formData.sbu}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <select
                                                name="sbu"
                                                value={formData.sbu}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value="">Select SBU</option>
                                                {apiSbus.map((sbu) => (
                                                    <option key={sbu} value={sbu}>{sbu}</option>
                                                ))}
                                            </select>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setUseCustomSbu(!useCustomSbu)}
                                            className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            {useCustomSbu ? 'Use List' : 'Custom'}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Branch <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        {useCustomBranch ? (
                                            <input
                                                type="text"
                                                name="branch"
                                                value={formData.branch}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <select
                                                name="branch"
                                                value={formData.branch}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value="">Select Branch</option>
                                                {apiBranches.map((branch) => (
                                                    <option key={branch} value={branch}>{branch}</option>
                                                ))}
                                            </select>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setUseCustomBranch(!useCustomBranch)}
                                            className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            {useCustomBranch ? 'Use List' : 'Custom'}
                                        </button>
                                    </div>
                                </div>

                                {showOptionalDetails && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Department <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex gap-2">
                                                {useCustomDepartment ? (
                                                    <input
                                                        type="text"
                                                        name="department"
                                                        value={formData.department}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                ) : (
                                                    <select
                                                        name="department"
                                                        value={formData.department}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    >
                                                        <option value="">Select Department</option>
                                                        {apiDepartments.map((dept) => (
                                                            <option key={dept} value={dept}>{dept}</option>
                                                        ))}
                                                    </select>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setUseCustomDepartment(!useCustomDepartment)}
                                                    className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    {useCustomDepartment ? 'Use List' : 'Custom'}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Sub Department
                                            </label>
                                            <input
                                                type="text"
                                                name="subDepartment"
                                                value={formData.subDepartment}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Designation <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="designation"
                                                value={formData.designation}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-center">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Add Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CollectEmployee;