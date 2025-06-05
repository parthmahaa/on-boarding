import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import { API_URL } from '../../services/api';
import { decrypt } from '../../utilities/encrypt';
import Loader from '../../utilities/Loader';

interface WorkflowState {
  loan: string;
  attendanceRequest: string;
  expenseClaimInAdvance: string;
  leaveAndCOff: string;
  shiftChangeRequest: string;
  assets: string;
  overTimeApproval: string;
  advance: string;
  attendanceRegularization: string;
  resignationRequest: string;
  expenseClaim: string;
  pendingTravelExpense: string;
  travel: string;
}

const ApprovalWorkflow = () => {
  const [workflow, setWorkflow] = useState<WorkflowState>({
    loan: 'Mode A',
    attendanceRequest: 'Mode C',
    expenseClaimInAdvance: 'Mode A',
    leaveAndCOff: 'Mode B',
    shiftChangeRequest: 'Mode B',
    assets: 'Mode A',
    overTimeApproval: 'Mode B',
    advance: 'Mode A',
    attendanceRegularization: 'Mode B',
    resignationRequest: 'Mode C',
    expenseClaim: 'Mode C',
    pendingTravelExpense: 'Mode A',
    travel: 'Mode A'
  });
  const [loading, setLoading] = useState(true);
  let companyDetails : any = null
      try {
          const companyDetailsRaw = localStorage.getItem('companyDetails')
          companyDetails = companyDetailsRaw ? (decrypt(companyDetailsRaw)) : null
      } catch(e) {
          companyDetails = null
      }
  
      // Defensive check to avoid errors if companyDetails is null or malformed
      const companyId = companyDetails && companyDetails.companyId ? companyDetails.companyId : '';

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const response = await fetch(`${API_URL}/approval/${companyId}`);
        const result = await response.json();
        
        if (result.error) {
          toast.error(result.message);
        } else if (result.data) {
          const { companyId: _, ...workflowData } = result.data;
          setWorkflow(workflowData);
        }
      } catch (e: any) {
        toast.error('Failed to load workflow settings');
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchWorkflow();
    }
  }, [companyId]);

  const modes = ['Mode A', 'Mode B', 'Mode C'];

  const handleModeChange = (field: keyof WorkflowState, value: string) => {
    setWorkflow(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setWorkflow({
      loan: 'Mode A',
      attendanceRequest: 'Mode C',
      expenseClaimInAdvance: 'Mode A',
      leaveAndCOff: 'Mode B',
      shiftChangeRequest: 'Mode B',
      assets: 'Mode A',
      overTimeApproval: 'Mode B',
      advance: 'Mode A',
      attendanceRegularization: 'Mode B',
      resignationRequest: 'Mode C',
      expenseClaim: 'Mode C',
      pendingTravelExpense: 'Mode A',
      travel: 'Mode A'
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try{
        const response = await fetch(`${API_URL}/approval/${companyId}`,{
            method : 'PUT',
            headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workflow)
        })

        const result = await response.json()
        if(result.error){
            toast.error(result.message)
        }else{
            toast.success("Approval Worflow Submitted")
        }
    }catch(e:any){
        toast.error(e.message)
    }
  };

  const DropdownField = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="space-y-2">
        <label className="block text-gray-600 text-sm font-medium">
          {label}
        </label>    
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between hover:border-gray-400 transition-colors"
          >
            <span className="text-gray-700">{value}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50">
              {modes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    onChange(mode);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  {mode}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <Loader/>
  }

  return (
    <div className="max-w-full  bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Approval Workflow</h1>
        
        <div className="text-gray-600 space-y-1">
          <p className="font-medium">Modes to choose from:</p>
          <div className="text-sm space-y-1 ml-4">
            <p>Mode A: Primary or Secondary Manager any one's approve/reject is final status</p>
            <p>Mode B: First Primary Manager then Secondary Manager can approve/reject on request</p>
            <p>Mode C: Primary Manager can approve/reject but Secondary Manager action is final status</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <DropdownField
              label="Loan"
              value={workflow.loan}
              onChange={(value) => handleModeChange('loan', value)}
            />
            
            <DropdownField
              label="Attendance Request"
              value={workflow.attendanceRequest}
              onChange={(value) => handleModeChange('attendanceRequest', value)}
            />
            
            <DropdownField
              label="Expense Claim In Advance"
              value={workflow.expenseClaimInAdvance}
              onChange={(value) => handleModeChange('expenseClaimInAdvance', value)}
            />
            
            <DropdownField
              label="Leave & C-Off"
              value={workflow.leaveAndCOff}
              onChange={(value) => handleModeChange('leaveAndCOff', value)}
            />
            
            <DropdownField
              label="Shift Change Request"
              value={workflow.shiftChangeRequest}
              onChange={(value) => handleModeChange('shiftChangeRequest', value)}
            />
            
            <DropdownField
              label="Assets"
              value={workflow.assets}
              onChange={(value) => handleModeChange('assets', value)}
            />
            
            <DropdownField
              label="Over Time Approval"
              value={workflow.overTimeApproval}
              onChange={(value) => handleModeChange('overTimeApproval', value)}
            />
            
            <DropdownField
              label="Advance"
              value={workflow.advance}
              onChange={(value) => handleModeChange('advance', value)}
            />
            
            <DropdownField
              label="Attendance Regularization"
              value={workflow.attendanceRegularization}
              onChange={(value) => handleModeChange('attendanceRegularization', value)}
            />
            
            <DropdownField
              label="Resignation Request"
              value={workflow.resignationRequest}
              onChange={(value) => handleModeChange('resignationRequest', value)}
            />
            
            <DropdownField
              label="Expense Claim"
              value={workflow.expenseClaim}
              onChange={(value) => handleModeChange('expenseClaim', value)}
            />
            
            <DropdownField
              label="Pending Travel Expense"
              value={workflow.pendingTravelExpense}
              onChange={(value) => handleModeChange('pendingTravelExpense', value)}
            />
            
            <DropdownField
              label="Travel"
              value={workflow.travel}
              onChange={(value) => handleModeChange('travel', value)}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium"
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ApprovalWorkflow;
