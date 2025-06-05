import React, { useState } from 'react';
import NoticePeriod from './WorkflowConfig/NoticePeriod';
import DepartmentClearance from './WorkflowConfig/DepartmentClearance';
import ProbationSetup from './WorkflowConfig/ProbationSetup';
import { useWorkflowStore } from '../../store/index';
import { formatWorkflowConfiguration } from '../../store';
import { API_URL } from '../../services/api';
import { toast } from 'react-toastify';
import Loader from '../../utilities/Loader';

const WorkflowConfiguration: React.FC = () => {
  const { isLoading, error, companyId } = useWorkflowStore();
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const state = useWorkflowStore();

  const saveConfiguration = async () => {
    setSaving(true);
    try {
      const payload = formatWorkflowConfiguration(state);
      const response = await fetch(`${API_URL}/workflow-configuration/add/${companyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.error) {
        toast.error(result.message);
        console.log(result.message);
      } else {
        toast.success(result.message);
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSaving(false);
    }
  };

  if(saving){
    return <Loader/>
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <div className="p-6">
        <NoticePeriod />
        <DepartmentClearance />
        <ProbationSetup />

        {(error || localError) && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error || localError}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button 
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors mr-3"
            onClick={() => window.location.reload()}
          >
            Cancel
          </button>
          <button 
            className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors btn-primary ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={saveConfiguration}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowConfiguration;