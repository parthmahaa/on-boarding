import React from 'react';
import FormSection from '../../ui/FormSection';
import ToggleSwitch from '../../ui/ToggleSwitch';
import { useWorkflowStore } from '../../../store/index';
import { Trash2 } from 'lucide-react';

const DepartmentClearance: React.FC = () => {
  const { departmentClearance, updateDepartmentClearance } = useWorkflowStore();

  // Add a default task on mount if there are no tasks
  React.useEffect(() => {
    if (!departmentClearance.tasks || departmentClearance.tasks.length === 0) {
      updateDepartmentClearance({
        tasks: [{ id: Date.now(), text: '' }]
      });
    }
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateDepartmentClearance({ [name]: value });
  };

  const handleToggleChange = (checked: boolean) => {
    updateDepartmentClearance({ isReportingClearance: checked });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateDepartmentClearance({ [name]: value });
  };

  const addTask = () => {
    updateDepartmentClearance({
      tasks: [...departmentClearance.tasks, { id: Date.now(), text: '' }]
    });
  };

  const updateTask = (index: number, text: string) => {
    const updatedTasks = [...departmentClearance.tasks];
    updatedTasks[index] = { ...updatedTasks[index], text };
    updateDepartmentClearance({ tasks: updatedTasks });
  };

  const removeTask = (index: number) => {
    const updatedTasks = departmentClearance.tasks.filter((_, i) => i !== index);
    updateDepartmentClearance({ tasks: updatedTasks });
  };

  return (
    <FormSection title="Department Clearance" className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 items-end">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={departmentClearance.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label htmlFor="poc" className="block text-sm font-medium text-gray-700 mb-1">
            POC <span className="text-red-500">*</span>
          </label>
          <select
            id="poc"
            name="poc"
            value={departmentClearance.poc}
            onChange={handleSelectChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            required
          >
            <option value="">Select POC</option>
            <option value="hr-manager">HR Manager</option>
            <option value="department-head">Department Head</option>
            <option value="team-lead">Team Lead</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="parentDepartment" className="block text-sm font-medium text-gray-700 mb-1">
            Parent Department <span className="text-red-500">*</span>
          </label>
          <select
            id="parentDepartment"
            name="parentDepartment"
            value={departmentClearance.parentDepartment}
            onChange={handleSelectChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            required
          >
            <option value="">Select Department</option>
            <option value="hr">Human Resources</option>
            <option value="finance">Finance</option>
            <option value="it">Information Technology</option>
            <option value="operations">Operations</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-3">
          <ToggleSwitch 
            id="isReportingClearance"
            checked={departmentClearance.isReportingClearance}
            onChange={handleToggleChange}
          />
          <label htmlFor="isReportingClearance" className="text-sm font-medium text-gray-700">
            Is Reporting Clearance
          </label>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Task <span className="text-red-500">*</span>
          </label>
          <button 
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
            onClick={addTask}
          >
            + Task
          </button>
        </div>
        
        {departmentClearance.tasks.map((task, index) => (
          <div key={task.id} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={task.text}
              onChange={(e) => updateTask(index, e.target.value)}
              placeholder="Task"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              onClick={() => removeTask(index)}
              className="text-red-500 p-2 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </FormSection>
  );
};

export default DepartmentClearance;