import React from 'react';
import FormSection from '../../ui/FormSection';
import DatePicker from '../../ui/DatePicker';
import RuleBuilder from '../../ui/RuleBuilder';
import { useWorkflowStore } from '../../../store/index';

// Add date formatting helper
function formatDateToDDMMMYYYY(date: Date | null): string | null {
  if (!date) return null;
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Helper to parse DD-MMM-YYYY string to Date object
function parseDDMMMYYYYToDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const [day, mon, year] = dateStr.split('-');
  const monthIndex = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(mon);
  if (monthIndex === -1) return null;
  return new Date(Number(year), monthIndex, Number(day));
}

const ProbationSetup: React.FC = () => {
  const { probationSetup, updateProbationSetup } = useWorkflowStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateProbationSetup({ [name]: value });
  };

  const handleDateChange = (date: Date | null) => {
      updateProbationSetup({ effectiveDate: date });
    };

  return (
    <FormSection title="Probation Setup" className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="policyName" className="block text-sm font-medium text-gray-700 mb-1">
            Policy Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="probationPolicyName"
            name="policyName"
            value={probationSetup.policyName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">
            Effective Date <span className="text-red-500">*</span>
          </label>
          <DatePicker
                      id="probationEffectiveDate"
                      selectedDate={probationSetup.effectiveDate}
                      onChange={handleDateChange}
                    />
        </div>
        
        <div>
          <label htmlFor="probationDays" className="block text-sm font-medium text-gray-700 mb-1">
            Probation Days <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="probationDays"
            name="probationDays"
            value={probationSetup.probationDays}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            required
          />
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">Members</h3>
          <button 
            className="text-sm bg-white text-blue-600 border border-blue-600 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
            onClick={() => updateProbationSetup({
              rules: [...probationSetup.rules, { 
                id: Date.now(), 
                condition: 'include', 
                field: '', 
                operator: '==', 
                value: [] 
              }]
            })}
          >
            + Add Rule
          </button>
        </div>
        <RuleBuilder 
          rules={probationSetup.rules}
          onChange={(rules) => updateProbationSetup({ rules })}
        />
      </div>
    </FormSection>
  );
};

export default ProbationSetup;