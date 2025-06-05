import React, { useState } from 'react';
import { X, Plus, Info } from 'lucide-react';

interface BranchFormProps {
  onClose: () => void;
}

const BranchForm: React.FC<BranchFormProps> = ({ onClose }) => {
  const [isPayrollBranch, setIsPayrollBranch] = useState(false);
  const [isEsicApplicable, setIsEsicApplicable] = useState(false);

  return (
    <div className="bg-white shadow-lg rounded-lg max-w-full mx-auto relative p-6">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
      >
        <X className='text-red-500 hover:cursor-pointer' size={30} />
      </button>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Branch Details</h2>

        {/* Branch Information */}
        <div className="mb-8">
          <hr className="mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                placeholder="Branch Name"
                required
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Pincode"
                required
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-1">
              <input
                type="text"
                placeholder="Country"
                required
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-1">
              <input
                type="text"
                placeholder="State"
                required
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-1">
              <input
                type="text"
                placeholder="City"
                required
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <textarea
                placeholder="Branch Address"
                required
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Branch Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Branch Settings</h3>
          <hr className="mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div>
              <input
                type="text"
                placeholder="Time Zone"
                required
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isPayrollBranch}
                  onChange={(e) => setIsPayrollBranch(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm">Payroll Branch</span>
              </label>
              <Info size={18} className="text-gray-600" />
            </div>
          </div>
        </div>

        {/* Compliance Details */}
        {isPayrollBranch && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Compliance Details</h3>
            <hr className="mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">PT Number</span>
                  <button
                    className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
                  >
                    <Plus size={16} />
                    PT No
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Enter PT Number"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">LWF Number</span>
                  <button
                    className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
                  >
                    <Plus size={16} />
                    LWF NO
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Enter LWF Number"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Show ESIC Number only if ESIC Applicable is checked */}
              {isEsicApplicable && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">ESIC Number</span>
                    <button
                      className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
                    >
                      <Plus size={16} />
                      A/C NO
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter ESIC Number"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div className="sm:col-span-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isEsicApplicable}
                    onChange={(e) => setIsEsicApplicable(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm">ESIC Applicable On Branch?</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 min-w-[100px]"
          >
            Reset
          </button>
          <button
            className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 min-w-[100px]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchForm;