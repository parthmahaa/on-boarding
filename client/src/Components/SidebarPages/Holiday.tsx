import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { ApiResponse } from '../../utilities/types';
import { decrypt } from '../../utilities/encrypt';
import { API_URL } from '../../services/api';

const HolidayManagement = () => {
  const [activeTab, setActiveTab] = useState('creation');
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [isOptional, setIsOptional] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isPayApplicable, setIsPayApplicable] = useState(false);

  const [assignData, setAssignData] = useState({
    year: '',
    holidayId: '',
    criteria: [{ field: '', value: [] as string[] }], // Explicitly type value as string[]
  });

  const [holidays, setHolidays] = useState<any[]>([]);
  const [holidaySearchTerm, setHolidaySearchTerm] = useState('');
  const [selectedHoliday, setSelectedHoliday] = useState<{id: string, name: string}>({ id: '', name: '' });
  const [showHolidayDropdown, setShowHolidayDropdown] = useState(false);

  const [dropdownStates, setDropdownStates] = useState<{[key: number]: boolean}>({});
  const [searchTerms, setSearchTerms] = useState<{[key: number]: string}>({});

  let userDetails: any = null;
  let companyDetails: any = null;
  try {
    const userDetailsRaw = localStorage.getItem('userDetails');
    userDetails = userDetailsRaw ? decrypt(userDetailsRaw) : null;
    const companyDetailsRaw = localStorage.getItem('companyDetails');
    companyDetails = companyDetailsRaw ? decrypt(companyDetailsRaw) : null;
  } catch (e) {
    userDetails = null;
    companyDetails = null;
  }

  const companyId = companyDetails?.companyId || '';
  const companyName = companyDetails?.companyName || '';

  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);

  // Add new state for dropdown values
  const [fieldValues, setFieldValues] = useState({
    branch: new Set<string>(),
    department: new Set<string>(),
    subDepartment: new Set<string>(),
    designation: new Set<string>(),
    grade: new Set<string>(),
    sbu: new Set<string>(),
    primaryManager: new Set<string>(),
    secondaryManager: new Set<string>(),
    status: new Set<string>(),
    employee: new Set<string>(),
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_URL}/employees/getEmployeeList/${companyId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result: ApiResponse = await response.json();
        setEmployees(result.data);
        setFilteredEmployees(result.data);

        const values = {
          branch: new Set<string>(),
          department: new Set<string>(),
          subDepartment: new Set<string>(),
          designation: new Set<string>(),
          grade: new Set<string>(),
          sbu: new Set<string>(),
          primaryManager: new Set<string>(),
          secondaryManager: new Set<string>(),
          status: new Set<string>(),
          employee: new Set<string>(),
        };

        result.data.forEach((emp: any) => {
          if (emp.branch) values.branch.add(emp.branch);
          if (emp.department) values.department.add(emp.department);
          if (emp.subDepartment) values.subDepartment.add(emp.subDepartment);
          if (emp.designation) values.designation.add(emp.designation);
          if (emp.grade) values.grade.add(emp.grade);
          if (emp.sbu) values.sbu.add(emp.sbu);
          if (emp.primaryManager) values.primaryManager.add(emp.primaryManager);
          if (emp.secondaryManager) values.secondaryManager.add(emp.secondaryManager);
          if (emp.status) values.status.add(emp.status);
          if (emp.fullName) values.employee.add(emp.fullName);
        });

        setFieldValues(values);
      } catch (err: any) {
        toast.error(err.message || 'Something went wrong');
      }
    };
    if (companyId) fetchEmployees();
  }, [companyId]);

  // Add new useEffect to fetch holidays
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch(`${API_URL}/holidays/list?companyId=${companyId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result: ApiResponse = await response.json();
        setHolidays(result.data || []);
      } catch (err: any) {
        toast.error(err.message || 'Failed to fetch holidays');
      }
    };
    if (companyId) fetchHolidays();
  }, [companyId]);

  // Utility to format date as DD-MMM-YYYY
  const formatDateDDMMMYYYY = (dateStr: string) => {
    if (!dateStr) return '';
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleAddHoliday = async () => {
    const payload = {
      holidayName,
      holidayDate: formatDateDDMMMYYYY(holidayDate),
      isOptionalHoliday: isOptional,
      isRecurringHoliday: isRecurring,
      isHolidayPayApplicable: isPayApplicable,
      companyId: companyId,
    };
    try {
      const response = await fetch(`${API_URL}/holidays/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json();
      console.log(result);
      if (!result.error) {
        toast.success("Holiday Added")
      } else {
        toast.error(result.message)
      }
    } catch (err: any) {
      toast.error("Error:", err.message)
    }
  };

  // Filter holidays based on search term
  const filteredHolidays = holidays.filter(holiday => 
    holiday.holidayName.toLowerCase().includes(holidaySearchTerm.toLowerCase())
  );

  const handleAssignHoliday = async () => {
    if (!selectedHoliday.id) {
      toast.error('Please select a holiday');
      return;
    }

    const payload = {
      holidayId: selectedHoliday.id,
      year: assignData.year,
      employees: filteredEmployees.map(emp => emp.employeeId),
      criteria: assignData.criteria,
      status: "ACTIVE"
    };

    console.log(payload);

    try {
      const response = await fetch(`${API_URL}/holidays/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!result.error) {
        toast.success('Holiday assigned successfully');
      } else {
        console.log(result.message);
        toast.error(result.message);
      }
    } catch (err: any) {
      console.log(err.message);
      toast.error(err.message || 'Failed to assign holiday');
    }
  };

  const handleAddRule = () => {
    setAssignData((prev) => ({
      ...prev,
      criteria: [...prev.criteria, { field: '', value: [] as string[] }], // Explicitly type value as string[]
    }));
  };

  const handleRuleChange = (index: number, key: 'field' | 'value', val: string | string[]) => {
    const updated = [...assignData.criteria];
    if (key === 'field') {
      updated[index][key] = val as string;
      updated[index].value = []; // Reset values when field changes
    } else {
      updated[index][key] = val as string[];
    }
    setAssignData({ ...assignData, criteria: updated });

    // Filter employees based on all criteria
    let filtered = [...employees];
    updated.forEach(({ field, value }) => {
      if (field && Array.isArray(value) && value.length > 0) {
        filtered = filtered.filter((emp) => {
          return value.some(selectedValue => {
            const searchValue = selectedValue.toLowerCase();
            switch(field) {
              case 'employee':
                return emp.fullName?.toLowerCase().includes(searchValue);
              case 'branch':
              case 'department':
              case 'designation':
              case 'grade':
              case 'sbu':
                return emp[field]?.toLowerCase() === searchValue;
              default:
                return false;
            }
          });
        });
      }
    });
    setFilteredEmployees(filtered);
  };

  const toggleDropdown = (index: number) => {
    setDropdownStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const addValueToRule = (index: number, value: string) => {
    const currentValues = assignData.criteria[index].value as string[];
    if (!currentValues.includes(value)) {
      handleRuleChange(index, 'value', [...currentValues, value]);
    }
    setDropdownStates(prev => ({ ...prev, [index]: false }));
    setSearchTerms(prev => ({ ...prev, [index]: '' }));
  };

  const handleDeleteRule = (index: number) => {
    setAssignData(prev => ({
      ...prev,
      criteria: prev.criteria.filter((_, i) => i !== index),
    }));
  };

  const removeValueFromRule = (index: number, valueToRemove: string) => {
    const currentValues = assignData.criteria[index].value as string[];
    const newValues = currentValues.filter(v => v !== valueToRemove);
    handleRuleChange(index, 'value', newValues);
  };

  const getFilteredFieldValues = (field: string, index: number) => {
    if (!field) return [];
    const searchTerm = searchTerms[index] || '';
    const allValues = Array.from(fieldValues[field as keyof typeof fieldValues]);
    return allValues.filter(value => 
      value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex mb-6 border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'creation' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
            onClick={() => setActiveTab('creation')}
          >
            Holiday Creation
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'allocation' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
            onClick={() => setActiveTab('allocation')}
          >
            Holiday Allocation
          </button>
        </div>

        {activeTab === 'creation' ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Holiday Creation</h2>
            <div className="flex flex-wrap gap-4 items-center mb-4">
              <input
                type="text"
                placeholder="Holiday Name"
                value={holidayName}
                onChange={(e) => setHolidayName(e.target.value)}
                className="flex-1 p-2 border rounded-md"
              />
              <input
                type="date"
                value={holidayDate}
                onChange={(e) => setHolidayDate(e.target.value)}
                className="p-2 border rounded-md"
              />
              <label className="text-sm">
                <input
                  type="checkbox"
                  checked={isOptional}
                  onChange={() => setIsOptional(!isOptional)}
                  className="mr-1"
                />
                Optional
              </label>
              <label className="text-sm">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={() => setIsRecurring(!isRecurring)}
                  className="mr-1"
                />
                Recurring
              </label>
              <label className="text-sm">
                <input
                  type="checkbox"
                  checked={isPayApplicable}
                  onChange={() => setIsPayApplicable(!isPayApplicable)}
                  className="mr-1"
                />
                Pay Applicable
              </label>
              <button
                onClick={handleAddHoliday}
                className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Holiday Allocation</h2>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Year"
                value={assignData.year}
                onChange={(e) => setAssignData({ ...assignData, year: e.target.value })}
                className="w-1/3 p-2 border rounded-md"
              />
              <div className="w-2/3 relative">
                <div className="relative">
                  <button
                    type="button"
                    className="w-full p-2 border rounded-md text-left bg-white"
                    onClick={() => setShowHolidayDropdown((prev) => !prev)}
                  >
                    {selectedHoliday.name || 'Select Holiday'}
                    <span className="float-right">▼</span>
                  </button>
                  {showHolidayDropdown && (
                    <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                      <input
                        type="text"
                        placeholder="Search Holiday"
                        value={holidaySearchTerm}
                        onChange={(e) => setHolidaySearchTerm(e.target.value)}
                        className="w-full p-2 border-b rounded-t-md focus:outline-none"
                        autoFocus
                      />
                      {filteredHolidays.length === 0 ? (
                        <div className="p-2 text-gray-400">No holidays found</div>
                      ) : (
                        filteredHolidays.map((holiday) => (
                          <div
                            key={holiday._id}
                            className={`p-2 cursor-pointer hover:bg-gray-100 ${
                              selectedHoliday.id === holiday._id ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => {
                              setSelectedHoliday({ id: holiday.id, name: holiday.holidayName });
                              setShowHolidayDropdown(false);
                            }}
                          >
                            {holiday.holidayName}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <h4 className="text-gray-700 font-medium mb-2">Select Applicability Criteria</h4>
            {assignData.criteria.map((rule, idx) => (
              <div key={idx} className="flex gap-3 mb-2 items-center">
                <select
                  value={rule.field}
                  onChange={(e) => handleRuleChange(idx, 'field', e.target.value)}
                  className="p-2 border rounded-md"
                >
                  <option value="">Select Field</option>
                  <option value="branch">Branch</option>
                  <option value="department">Department</option>
                  <option value="designation">Designation</option>
                  <option value="grade">Grade</option>
                  <option value="sbu">SBU</option>
                  <option value="employee">Employee</option>
                </select>

                <div className="flex-1 relative">
                  {/* Selected values display */}
                  <div className="min-h-[40px] p-2 border rounded-md bg-white flex flex-wrap gap-1 items-center">
                    {(rule.value as string[]).map((selectedValue, valueIdx) => (
                      <span
                        key={valueIdx}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                      >
                        {selectedValue}
                        <button
                          type="button"
                          onClick={() => removeValueFromRule(idx, selectedValue)}
                          className="text-blue-600 hover:text-blue-800 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => toggleDropdown(idx)}
                      className="text-gray-500 hover:text-gray-700 px-2 py-1"
                    >
                      {(rule.value as string[]).length === 0 ? 'Select Values' : '+ Add More'}
                    </button>
                  </div>

                  {/* Dropdown */}
                  {dropdownStates[idx] && (
                    <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                      <input
                        type="text"
                        placeholder="Search values..."
                        value={searchTerms[idx] || ''}
                        onChange={(e) => setSearchTerms(prev => ({ ...prev, [idx]: e.target.value }))}
                        className="w-full p-2 border-b rounded-t-md focus:outline-none"
                        autoFocus
                      />
                      {getFilteredFieldValues(rule.field, idx).map((value) => (
                        <div
                          key={value}
                          className={`p-2 cursor-pointer hover:bg-gray-100 ${
                            (rule.value as string[]).includes(value) ? 'bg-blue-50 text-gray-500' : ''
                          }`}
                          onClick={() => addValueToRule(idx, value)}
                        >
                          {value}
                          {(rule.value as string[]).includes(value) && (
                            <span className="float-right text-gray-500">✓</span>
                          )}
                        </div>
                      ))}
                      {getFilteredFieldValues(rule.field, idx).length === 0 && (
                        <div className="p-2 text-gray-400">No values found</div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteRule(idx)}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded-md hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              onClick={handleAddRule}
              className="mt-2 mb-4 bg-gray-200 text-blue-600 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              + Add Rule
            </button>

            <div className="text-right">
              <button
                onClick={handleAssignHoliday}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
              >
                Allocate
              </button>
            </div>
            {/* <h4 className="mt-6 text-gray-800 font-medium">Filtered Employees</h4>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
              {filteredEmployees.map((emp, i) => (
                <li key={i}>
                  {emp.firstName} {emp.lastName} ({emp.email})
                </li>
              ))}
            </ul> */}
          </>
        )}
      </div>
    </div>
  );
};

export default HolidayManagement;