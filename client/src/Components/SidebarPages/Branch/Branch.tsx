import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Switch,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Plus, History, Copy, Edit } from 'lucide-react';
import BranchForm from './BranchForm';
import { API_URL } from '../../../services/api';
import { useWorkflowStore } from '../../../store';
import { toast } from 'react-toastify';
import Loader from '../../../utilities/Loader';

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
  LWNumber: string;
  ESICNumber: string;
  // Add an id field if not present
  id?: string;
}

interface BranchListProps {
  onAddBranch: () => void;
}

const BranchList: React.FC<BranchListProps> = ({ onAddBranch }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingIds, setUpdatingIds] = useState<string[]>([]); // Track switches being updated
  const { companyId } = useWorkflowStore();

  useEffect(() => {
    const fetchBranches = async () => {
      if (!companyId) {
        toast.error('Company ID is missing');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/branch/${companyId}`); // Update endpoint as needed
        const result = await res.json();
        if (result.error) {
          toast.error(result.message)
        }
        else if (result.status === 200) {
          setBranches(result.data);
        }
      } catch (e: any) {
        console.log(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, [companyId]); // Removed statusChangeTrigger as it's no longer needed

  // Handler for status toggle
  const handleStatusToggle = async (branchIdx: number, branchId : any, currentStatus?: boolean | null) => {
    if (!branchId) return;
    
    const newStatus = currentStatus === null ? true : !currentStatus;
    setUpdatingIds(prev => [...prev, branchId]); // Show loading state

    try {
      const res = await fetch(`${API_URL}/branch/status/${branchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      
      if (result.error) {
        toast.error(result.message);
        setBranches(prev =>
          prev.map((b, idx) => idx === branchIdx ? { ...b, status: currentStatus ?? null } : b)
        );
      } else {
        setBranches(prev =>
          prev.map((b, idx) => idx === branchIdx ? { ...b, status: newStatus } : b)
        );
        toast.success('Status updated');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to update status');
      // Revert on error
      setBranches(prev =>
        prev.map((b, idx) => idx === branchIdx ? { ...b, status: currentStatus ?? null } : b)
      );
    } finally {
      setUpdatingIds(prev => prev.filter(id => id !== branchId)); // Remove loading state
    }
  };

  if(loading){
    return <Loader/>
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 1 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Branch
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={16} />}
          onClick={onAddBranch}
          sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
        >
          Branch
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Branch Name</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>State Name</TableCell>
              <TableCell>Branch City</TableCell>
              <TableCell>Time Zone</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              branches.map((row, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {row.branchName}
                      {row.isPayrollBranch && (
                        <Typography
                          className='bg-gray-200 p-1 rounded-2xl'
                          component="span"
                          sx={{
                            fontSize: '0.75rem',
                            color: '#22c55e',
                            fontWeight: 500,
                          }}
                        >
                          Payroll Branch
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{row.country}{row.pincode ? `-${row.pincode}` : ''}</TableCell>
                  <TableCell>{row.state}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.timeZone}</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>
                    <Switch
                      checked={row.status === true}
                      disabled={updatingIds.includes(row.id || '')}
                      size="small"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#0ea5e9',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#0ea5e9',
                        },
                      }}
                      onChange={() => handleStatusToggle(idx, row.id, row.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small">
                        <Edit size={16} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

// Main Branch component to toggle between list and form
const Branch: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Box sx={{ p: 2 }}>
      {!showForm ? (
        <BranchList onAddBranch={() => setShowForm(true)} />
      ) : (
        <BranchForm onClose={() => setShowForm(false)} />
      )}
    </Box>
  );
};

export default Branch;