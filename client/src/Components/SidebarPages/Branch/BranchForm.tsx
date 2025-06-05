import React, { useState, useEffect } from 'react';
import { X, Plus, Info } from 'lucide-react';
import { API_URL } from '../../../services/api';
import { toast } from 'react-toastify';
import { useWorkflowStore } from '../../../store';

interface Branch {
  branchName: string;
  pincode: string;
  country: string;
  state: string;
  city: string;
  branchAddress: string;
  timeZone: string;
  isPayrollBranch: boolean;
  status: boolean | null;
  PTNumber: string;
  LWFNumber: string;  // Changed from LWNumber to be consistent
  ESICNumber: string;
  id?: string;
}

interface BranchFormProps {
  onClose: () => void;
  initialData?: Branch | null;
  mode?: 'create' | 'edit';
}

const BranchForm: React.FC<BranchFormProps> = ({ onClose, initialData, mode = 'create' }) => {
  const { companyId } = useWorkflowStore();
  const [formData, setFormData] = useState({
    branchName: '',
    pincode: '',
    country: '',
    state: '',
    city: '',
    branchAddress: '',
    timeZone: '',
    isPayrollBranch: false,
    PTNumber: '',
    LWFNumber: '',  // Changed from LWNumber to be consistent
    ESICNumber: '',
  });

  const [isEsicApplicable, setIsEsicApplicable] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        branchName: initialData.branchName || '',
        pincode: initialData.pincode || '',
        country: initialData.country || '',
        state: initialData.state || '',
        city: initialData.city || '',
        branchAddress: initialData.branchAddress || '',
        timeZone: initialData.timeZone || '',
        isPayrollBranch: initialData.isPayrollBranch || false,
        PTNumber: initialData.PTNumber || '',
        LWFNumber: initialData.LWFNumber || '',  // Changed from LWNumber
        ESICNumber: initialData.ESICNumber || '',
      });
      setIsEsicApplicable(!!initialData.ESICNumber);
    }
  }, [initialData, mode]);

  useEffect(() => {
    if (!isEsicApplicable) {
      setFormData(prev => ({ ...prev, ESICNumber: '' }));
    }
  }, [isEsicApplicable]);

  // Add new useEffect to handle clearing compliance fields
  useEffect(() => {
    if (!formData.isPayrollBranch) {
      setFormData(prev => ({
        ...prev,
        PTNumber: '',
        LWFNumber: '',
        ESICNumber: ''
      }));
      setIsEsicApplicable(false);
    }
  }, [formData.isPayrollBranch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) {
      toast.error('Company ID is missing');
      return;
    }

    if (formData.isPayrollBranch) {
      if (!formData.PTNumber.trim()) {
        toast.error('PT Number is required for payroll branch');
        return;
      }
      if (!formData.LWFNumber.trim()) {
        toast.error('LWF Number is required for payroll branch');
        return;
      }
    }

    const payload = {
      ...formData,
      // Only add status for new branches
      ...(mode === 'create' ? { status: true } : {}),
      PTNumber: formData.isPayrollBranch ? formData.PTNumber : '',
      LWFNumber: formData.isPayrollBranch ? formData.LWFNumber : '',
      ESICNumber: formData.isPayrollBranch && isEsicApplicable ? formData.ESICNumber : ''
    };

    try {
      const url = mode === 'edit' 
        ? `${API_URL}/branch/${initialData?.id}` 
        : `${API_URL}/branch/${companyId}`;
      
      const method = mode === 'edit' ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  const handleReset = () => {
    if (mode === 'edit' && initialData) {
      setFormData({
        branchName: initialData.branchName || '',
        pincode: initialData.pincode || '',
        country: initialData.country || '',
        state: initialData.state || '',
        city: initialData.city || '',
        branchAddress: initialData.branchAddress || '',
        timeZone: initialData.timeZone || '',
        isPayrollBranch: initialData.isPayrollBranch || false,
        PTNumber: initialData.PTNumber || '',
        LWFNumber: initialData.LWFNumber || '',  // Changed from LWNumber
        ESICNumber: initialData.ESICNumber || '',
      });
    } else {
      setFormData({
        branchName: '',
        pincode: '',
        country: '',
        state: '',
        city: '',
        branchAddress: '',
        timeZone: '',
        isPayrollBranch: false,
        PTNumber: '',
        LWFNumber: '',
        ESICNumber: '',
      });
    }
    setIsEsicApplicable(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg max-w-full mx-auto relative p-6">
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
                name="branchName"
                value={formData.branchName}
                onChange={handleChange}
                placeholder="Branch Name"
                required
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                required
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-1">
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                required
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-1">
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-1">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <textarea
                name="branchAddress"
                value={formData.branchAddress}
                onChange={handleChange}
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
                name="timeZone"
                value={formData.timeZone}
                onChange={handleChange}
                placeholder="Time Zone"
                required
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPayrollBranch}
                  onChange={(e) => setFormData({ ...formData, isPayrollBranch: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm">Payroll Branch</span>
              </label>
              <Info size={18} className="text-gray-600" />
            </div>
          </div>
        </div>

        {/* Compliance Details */}
        {formData.isPayrollBranch && (
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
                  name="PTNumber"
                  value={formData.PTNumber}
                  onChange={handleChange}
                  placeholder="Enter PT Number"
                  required={formData.isPayrollBranch}
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
                  name="LWFNumber"
                  value={formData.LWFNumber}
                  onChange={handleChange}
                  placeholder="Enter LWF Number"
                  required={formData.isPayrollBranch}
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
                    name="ESICNumber"
                    value={formData.ESICNumber}
                    onChange={handleChange}
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
            type="button"
            onClick={handleReset}
            className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 min-w-[100px]"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 min-w-[100px]"
          >
            {mode === 'edit' ? 'Update' : 'Submit'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default BranchForm;