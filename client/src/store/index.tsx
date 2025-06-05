import { create } from 'zustand';
import type { Rule, Task } from '../utilities/types';
import { API_URL } from '../services/api';
import { decrypt } from '../utilities/encrypt';
import { toast } from 'react-toastify';

// Helper to format Date to DD-MMM-YYYY
function formatDateToDDMMMYYYY(date: Date | string | null): string | null {
  if (!date) return null;
  if (typeof date === 'string' && /^\d{2}-[A-Za-z]{3}-\d{4}$/.test(date)) return date;
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

// Helper to format Date from DD-MMM-YYYY to Date object
function parseDateFromDDMMMYYYY(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('-');
  const monthIndex = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    .indexOf(month.toLowerCase());
  if (monthIndex === -1) return null;
  return new Date(parseInt(year), monthIndex, parseInt(day));
}

// Helper to format the workflow configuration as per requirements
export function formatWorkflowConfiguration(state: any) {
  return {
    noticePeriod: {
      policyName: state.noticePeriod.policyName,
      effectiveDate: formatDateToDDMMMYYYY(state.noticePeriod.effectiveDate),
      noticePeriodDuringProbation: Number(state.noticePeriod.noticePeriodProbation),
      noticePeriodAfterConfirmation: Number(state.noticePeriod.noticePeriodConfirmation),
      noticePeriodMembers: (state.noticePeriod.rules || []).map((rule: any) => ({
        type: rule.field,
        values: rule.value,
      })),
    },
    departmentClearance: {
      departmentName: state.departmentClearance.name,
      poc: state.departmentClearance.poc,
      isReportingClearance: state.departmentClearance.isReportingClearance,
      parentDepartment: state.departmentClearance.parentDepartment,
      departmentTasks: (state.departmentClearance.tasks || []).map((task: any) => task.text).join(', '),
    },
    probationSetup: {
      policyName: state.probationSetup.policyName,
      effectiveDate: formatDateToDDMMMYYYY(state.probationSetup.effectiveDate),
      probationDays: Number(state.probationSetup.probationDays),
      probationMembers: (state.probationSetup.rules || []).map((rule: any) => ({
        type: rule.field,
        values: rule.value,
      })),
    }
  };
}

interface WorkflowState {
  // Field options data
  fieldOptions: {
    branches: string[];
    departments: string[];
    designations: string[];
    grades: string[];
    sbus: string[];
    employees: string[];
    employeeTypes: string[];
    employmentTypes: string[];
  };
  isLoading: boolean;
  error: string | null;

  // Notice Period State
  noticePeriod: {
    policyName: string;
    effectiveDate: Date | null;
    noticePeriodProbation: string;
    noticePeriodConfirmation: string;
    rules: Rule[];
  };

  // Department Clearance State
  departmentClearance: {
    name: string;
    poc: string;
    parentDepartment: string;
    isReportingClearance: boolean;
    tasks: Task[];
  };

  // Probation Setup State
  probationSetup: {
    policyName: string;
    effectiveDate: Date | null;
    probationDays: string;
    rules: Rule[];
  };

  // User and Company Details
  userDetails: any;
  companyDetails: any;
  companyId: string | null;

  // Actions
  fetchFieldOptions: () => Promise<void>;
  fetchWorkflowConfigurations: () => Promise<void>;
  updateNoticePeriod: (data: Partial<WorkflowState['noticePeriod']>) => void;
  updateDepartmentClearance: (data: Partial<WorkflowState['departmentClearance']>) => void;
  updateProbationSetup: (data: Partial<WorkflowState['probationSetup']>) => void;
  setUserDetails: (user: any) => void;
  setCompanyDetails: (company: any) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => {
  // Read from localStorage and decrypt if available
  let userDetails = null;
  let companyDetails = null;
  let companyId = null;
  try {
    const userDetailsRaw = localStorage.getItem('userDetails');
    userDetails = userDetailsRaw ? decrypt(userDetailsRaw) : null;
    const companyDetailsRaw = localStorage.getItem('companyDetails');
    companyDetails = companyDetailsRaw ? decrypt(companyDetailsRaw) : null;
    companyId = companyDetails?.companyId ?? null;
  } catch (e) {
    userDetails = null;
    companyDetails = null;
    companyId = null;
  }

  return {
    // Initial state
    fieldOptions: {
      branches: [],
      departments: [],
      designations: [],
      grades: [],
      sbus: [],
      employees: [],
      employeeTypes: [],
      employmentTypes: [],
    },
    isLoading: false,
    error: null,

    noticePeriod: {
      policyName: 'Intern',
      effectiveDate: null,
      noticePeriodProbation: '10',
      noticePeriodConfirmation: '10',
      rules: [],
    },

    departmentClearance: {
      name: 'Account Clearance',
      poc: 'HR-Manager',
      parentDepartment: 'Finance',
      isReportingClearance: false,
      tasks: [],
    },

    probationSetup: {
      policyName: 'New Joining',
      effectiveDate: null,
      probationDays: '20',
      rules: [],
    },

    userDetails,
    companyDetails,
    companyId,

    // Actions
    fetchFieldOptions: async () => {
      try {
        set({ isLoading: true, error: null });
        
        const [
          branchesRes,
          departmentsRes,
          designationsRes,
          gradesRes,
          sbusRes,
          employeesRes,
          employeeTypes,
          employmentTypes,
        ] = await Promise.all([
          fetch(`${API_URL}/branch/${companyId}`).then(res => res.json()),
          fetch(`${API_URL}/employees/departments/${companyId}`).then(res => res.json()),
          fetch(`${API_URL}/employees/designations/${companyId}`).then(res => res.json()),
          fetch(`${API_URL}/employees/grades/${companyId}`).then(res => res.json()),
          fetch(`${API_URL}/sbu/${companyId}`).then(res => res.json()),
          fetch(`${API_URL}/employees/names/${companyId}`).then(res => res.json()),
          fetch(`${API_URL}/employees/employee-types/${companyId}`).then(res => res.json()),
          fetch(`${API_URL}/employees/employment-types/${companyId}`).then(res => res.json()),
        ]);

        set({
          fieldOptions: {
            branches: Array.isArray(branchesRes.data) ? branchesRes.data.map((b: any) => b.branchName) : [],
            departments: departmentsRes ?? [],
            designations: designationsRes ?? [],
            grades: gradesRes ?? [],
            sbus: Array.isArray(sbusRes.data) ? sbusRes.data.map((s: any) => s.name) : [],
            employees: employeesRes ?? [],
            employeeTypes: employeeTypes ?? [],
            employmentTypes: employmentTypes ?? [],
          },
          isLoading: false,
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch field options',
          isLoading: false 
        });
      }
    },

    fetchWorkflowConfigurations: async () => {
      const { companyId } = get();
      if (!companyId) {
        set({ error: 'Company ID not found', isLoading: false });
        toast.error('Company ID not found');
        return;
      }

      try {
        set({ isLoading: true, error: null });

        const response = await fetch(`${API_URL}/workflow-configuration/${companyId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch workflow configurations: ${response.statusText}`);
        }
        const configs = await response.json();

        // For simplicity, take the first configuration to populate the state
        // If you need to handle multiple configs, modify the UI to display a list
        const config = configs[0] || {};

        set({
          noticePeriod: {
            policyName: config.noticePeriod?.policyName || 'Intern',
            effectiveDate: parseDateFromDDMMMYYYY(config.noticePeriod?.effectiveDate) || null,
            noticePeriodProbation: config.noticePeriod?.noticePeriodDuringProbation?.toString() || '10',
            noticePeriodConfirmation: config.noticePeriod?.noticePeriodAfterConfirmation?.toString() || '10',
            rules: (config.noticePeriod?.noticePeriodMembers || []).map((member: any) => ({
              id: Math.random().toString(36).substring(2), // Generate a temporary ID
              condition: 'include', // Default condition (adjust as needed)
              field: member.type,
              operator: '==', // Default operator (adjust as needed)
              value: member.values,
            })),
          },
          departmentClearance: {
            name: config.departmentClearance?.departmentName || 'Account Clearance',
            poc: config.departmentClearance?.poc || 'HR-Manager',
            parentDepartment: config.departmentClearance?.parentDepartment || 'Finance',
            isReportingClearance: config.departmentClearance?.isReportingClearance || false,
            tasks: (config.departmentClearance?.departmentTasks?.split(', ') || []).map((text: string) => ({
              id: Math.random().toString(36).substring(2),
              text,
            })),
          },
          probationSetup: {
            policyName: config.probationSetup?.policyName || 'New Joining',
            effectiveDate: parseDateFromDDMMMYYYY(config.probationSetup?.effectiveDate) || null,
            probationDays: config.probationSetup?.probationDays?.toString() || '20',
            rules: (config.probationSetup?.probationMembers || []).map((member: any) => ({
              id: Math.random().toString(36).substring(2),
              condition: 'include',
              field: member.type,
              operator: '==',
              value: member.values,
            })),
          },
          isLoading: false,
        });

        if (configs.length === 0) {
          toast.info('No workflow configurations found for this company');
        }
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to fetch workflow configurations',
          isLoading: false,
        });
        toast.error(error instanceof Error ? error.message : 'Failed to fetch workflow configurations');
      }
    },

    updateNoticePeriod: (data) => {
      set((state) => ({
        noticePeriod: {
          ...state.noticePeriod,
          ...data,
        },
      }));
    },

    updateDepartmentClearance: (data) => {
      set((state) => ({
        departmentClearance: {
          ...state.departmentClearance,
          ...data,
        },
      }));
    },

    updateProbationSetup: (data) => {
      set((state) => ({
        probationSetup: {
          ...state.probationSetup,
          ...data,
        },
      }));
    },

    setUserDetails: (user) => set({ userDetails: user }),

    setCompanyDetails: (company) =>
      set({
        companyDetails: company,
        companyId: company?.companyId ?? null,
      }),
  };
});