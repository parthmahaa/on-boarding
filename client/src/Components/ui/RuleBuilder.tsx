import React, { useState, useEffect, useRef } from 'react';
import type { Rule } from '../../utilities/types';
import { Search, User, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '../../store';

interface RuleBuilderProps {
  rules: Rule[];
  onChange: (rules: Rule[]) => void;
}

const fieldOptions = [
  { value: 'branch', label: 'Branch' },
  { value: 'department', label: 'Department' },
  { value: 'designation', label: 'Designation' },
  { value: 'grade', label: 'Grade' },
  { value: 'sbu', label: 'SBU' },
  { value: 'employee', label: 'Employee' },
  { value: 'employeeType', label: 'Employee Type' },
  { value: 'employmentType', label: 'Employment Type' }
];

const RuleBuilder: React.FC<RuleBuilderProps> = ({ rules, onChange }) => {
  const [dropdownStates, setDropdownStates] = useState<Record<number, boolean>>({});
  const [searchTerms, setSearchTerms] = useState<Record<number, string>>({});
  // Add refs for each dropdown
  const dropdownRefs = useRef<Array<HTMLDivElement | null>>([]);

  const toggleDropdown = (ruleIndex: number) => {
    setDropdownStates(prev => ({
      ...Object.fromEntries(Object.keys(prev).map(k => [k, false])), // close all others
      [ruleIndex]: !prev[ruleIndex]
    }));
  };

  const handleConditionChange = (ruleIndex: number, value: string) => {
    const updatedRules = rules.map((rule, idx) => 
      idx === ruleIndex ? { ...rule, condition: value as 'include' | 'exclude' } : rule
    );
    onChange(updatedRules);
  };

  const handleFieldChange = (ruleIndex: number, value: string) => {
    const updatedRules = rules.map((rule, idx) => 
      idx === ruleIndex ? { ...rule, field: value, value: [] } : rule
    );
    onChange(updatedRules);
  };

  const handleOperatorChange = (ruleIndex: number, value: string) => {
    const updatedRules = rules.map((rule, idx) => 
      idx === ruleIndex ? { ...rule, operator: value as '==' | '!=' } : rule
    );
    onChange(updatedRules);
  };

  const addValueToRule = (ruleIndex: number, value: string) => {
    const updatedRules = rules.map((rule, idx) => {
      if (idx === ruleIndex) {
        const currentValues = rule.value as string[];
        if (!currentValues.includes(value)) {
          return { ...rule, value: [...currentValues, value] };
        }
      }
      return rule;
    });
    onChange(updatedRules);
  };

  const removeValueFromRule = (ruleIndex: number, value: string) => {
    const updatedRules = rules.map((rule, idx) => {
      if (idx === ruleIndex) {
        const currentValues = rule.value as string[];
        return { ...rule, value: currentValues.filter(v => v !== value) };
      }
      return rule;
    });
    onChange(updatedRules);
  };

  // Get field values from workflow store
  const fieldOptionsData = useWorkflowStore((state) => state.fieldOptions);
  const fetchFieldOptions = useWorkflowStore((state) => state.fetchFieldOptions);

  // Fetch field options if not loaded
  useEffect(() => {
    const isEmpty =
      !fieldOptionsData.branches.length &&
      !fieldOptionsData.departments.length &&
      !fieldOptionsData.designations.length &&
      !fieldOptionsData.grades.length &&
      !fieldOptionsData.sbus.length &&
      !fieldOptionsData.employees.length &&
      !fieldOptionsData.employeeTypes.length &&
      !fieldOptionsData.employmentTypes.length;
    if (isEmpty) {
      fetchFieldOptions();
    }
  }, [fieldOptionsData, fetchFieldOptions]);

  // Map field keys to store data, always fallback to []
  const fieldValues: Record<string, string[]> = {
    branch: Array.isArray(fieldOptionsData.branches) ? fieldOptionsData.branches : [],
    department: Array.isArray(fieldOptionsData.departments) ? fieldOptionsData.departments : [],
    designation: Array.isArray(fieldOptionsData.designations) ? fieldOptionsData.designations : [],
    grade: Array.isArray(fieldOptionsData.grades) ? fieldOptionsData.grades : [],
    sbu: Array.isArray(fieldOptionsData.sbus) ? fieldOptionsData.sbus : [],
    employee: Array.isArray(fieldOptionsData.employees) ? fieldOptionsData.employees : [],
    employeeType: Array.isArray(fieldOptionsData.employeeTypes) ? fieldOptionsData.employeeTypes : [],
    employmentType: Array.isArray(fieldOptionsData.employmentTypes) ? fieldOptionsData.employmentTypes : [],
  };

  const getFilteredFieldValues = (field: string, ruleIndex: number) => {
    if (!field) return [];
    const searchTerm = searchTerms[ruleIndex] || '';
    return fieldValues[field]?.filter(value => 
      value.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  };

  const handleDeleteRule = (ruleIndex: number) => {
    const updatedRules = rules.filter((_, idx) => idx !== ruleIndex);
    onChange(updatedRules);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      let clickedInside = false;
      dropdownRefs.current.forEach(ref => {
        if (ref && ref.contains(event.target as Node)) {
          clickedInside = true;
        }
      });
      if (!clickedInside) {
        setDropdownStates({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-50 rounded-md p-4">
      {rules.length === 0 ? (
        <div className="text-center py-6 text-gray-500 flex flex-col items-center justify-center">
          <User size={24} className="mb-2" />
          <p>No rules added yet. Click "+ Add Rule" to get started.</p>
        </div>
      ) : (
        rules.map((rule, ruleIndex) => (
          <div key={rule.id} className="mb-3 last:mb-0 p-3 bg-white rounded-md shadow-sm border border-gray-200 fade-in">
            <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
              <div className="flex items-center">
                <select
                  value={rule.condition}
                  onChange={(e) => handleConditionChange(ruleIndex, e.target.value)}
                  className="border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="include">Include</option>
                  <option value="exclude">Not</option>
                </select>
              </div>
              
              <div className="flex-1">
                <select
                  value={rule.field}
                  onChange={(e) => handleFieldChange(ruleIndex, e.target.value)}
                  className="w-full border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Select Field</option>
                  {fieldOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  value={rule.operator}
                  onChange={(e) => handleOperatorChange(ruleIndex, e.target.value)}
                  className="border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="==">==</option>
                  <option value="!=">!=</option>
                </select>
              </div>
              
              <div
                className="flex-1 relative rule-dropdown"
                ref={el => { dropdownRefs.current[ruleIndex] = el; }}
              >
                <div 
                  className="min-h-[38px] p-2 border border-gray-300 rounded-md bg-white flex flex-wrap gap-1 items-center cursor-pointer"
                  onClick={() => rule.field && toggleDropdown(ruleIndex)}
                >
                  {(rule.value as string[]).length > 0 ? (
                    <>
                      {(rule.value as string[]).map((selectedValue, valueIdx) => (
                        <span
                          key={valueIdx}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                        >
                          {selectedValue}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeValueFromRule(ruleIndex, selectedValue);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-bold ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <span className="text-blue-600 text-sm">+ Add More</span>
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      {rule.field ? 'Select Values' : 'Select a field first'}
                    </span>
                  )}
                </div>
                
                {dropdownStates[ruleIndex] && rule.field && (
                  <div
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto fade-in"
                    onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
                  >
                    <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search values..."
                          value={searchTerms[ruleIndex] || ''}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, [ruleIndex]: e.target.value }))}
                          className="w-full p-2 pl-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Search size={16} className="absolute left-2.5 top-3 text-gray-400" />
                      </div>
                    </div>
                    
                    <div>
                      {getFilteredFieldValues(rule.field, ruleIndex).length > 0 ? (
                        getFilteredFieldValues(rule.field, ruleIndex).map((value) => (
                          <div
                            key={value}
                            className={`p-2 cursor-pointer hover:bg-gray-100 transition-colors ${
                              (rule.value as string[]).includes(value) ? 'bg-blue-50' : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              addValueToRule(ruleIndex, value);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span>{value}</span>
                              {(rule.value as string[]).includes(value) && (
                                <span className="text-blue-600">✓</span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-gray-500">
                          No values found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleDeleteRule(ruleIndex)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                aria-label="Delete rule"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RuleBuilder;