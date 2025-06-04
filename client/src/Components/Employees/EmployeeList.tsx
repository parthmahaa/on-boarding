import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Table, TableHead, TableRow, TableCell, TableBody } from '../ui/Table';
import { Input } from '../ui/Input';
import { Pagination } from '../ui/Pagination';
import AddEmployeeForm from './AddEmployee';
import { Download, Filter } from 'lucide-react';
import { API_URL } from '../../services/api';
import type { ApiResponse } from '../../utilities/types';
import { toast } from 'react-toastify';
import Loader from '../../utilities/Loader';

// Updated Employee interface to match API response and allow nulls
interface Employee {
  fullName: string;
  id: string;
  joiningDate: string | null;
  createdAt: string ;
  email: string;
  branch: string | null;
  department: string 
  subDepartment: string | null;
  designation: string | null;
  grade: string | null;
  primaryManager: string | null;
  secondaryManager: string | null;
  status: string | null;
  sbu: string | null;
}

// Format date as DD-MMM-YYYY
function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

interface EmployeeTableProps {
  data?: Employee[];
  companyId?: string;
}

const validateEmployee = (employee: Employee): boolean => {
  const requiredFields = [
    employee.fullName,
    employee.email,
    employee.joiningDate,
    employee.sbu,
    employee.branch,
    employee.department,
    employee.designation
  ];

  // Check all fields are non-empty strings (and not null/undefined)
  return requiredFields.every(field => typeof field === 'string' && field.trim() !== '');
};


const EmployeeTable: React.FC<EmployeeTableProps> = ({ data, companyId }) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_URL}/employees/getEmployeeList/${companyId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();
        setEmployees(result.data);
        console.log(result.data);
      } catch (err: any) {
        toast.error(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if(companyId){
      fetchEmployees()
      setLoading(true)
    }
  }, [companyId, data]);

  const recordsPerPage = 6;
  const filteredData = employees.filter((emp) =>
    emp.fullName.toLowerCase().includes(filter.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
  );

  if(loading){
    return <Loader/>
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-1">
        <div className="space-x-2 flex">
          <Button variant="outline">
            <Download className="w-4 h-2" /> Export
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-2" /> Filter
          </Button>
        </div>
        <Input
          placeholder="Search employee..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-64"
        />
      </div>

      {showForm && <AddEmployeeForm />}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            <TableCell>Joining Date</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>SBU</TableCell>
            <TableCell>Branch</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Designation</TableCell>
            <TableCell>Primary Manager</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((emp, idx) => {
            const isValid = validateEmployee(emp);
            return (
              <TableRow key={idx} className={!isValid ? 'bg-red-100' : ''}>
                <TableCell>
                  <div className="font-semibold">{emp.fullName}</div>
                  <div className="text-sm text-gray-500">{emp.id}</div>
                </TableCell>
                <TableCell>
                  <div>{emp.joiningDate || '-'}</div>
                  <div className="text-sm text-gray-500">{emp.createdAt || '-'}</div>
                </TableCell>
                <TableCell className={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emp.email) ? 'text-red-600' : ''}>
                  {emp.email}
                </TableCell>
                <TableCell>{emp.sbu || '-'}</TableCell>
                <TableCell>{emp.branch || '-'}</TableCell>
                <TableCell>{emp.department || '-'}</TableCell>
                <TableCell>
                  <div>{emp.designation || '-'}</div>
                  <div className='text-gray-500 text-sm'>{emp.grade || '-'}</div>
                </TableCell>
                <TableCell className={!emp.primaryManager ? 'text-red-600' : ''}>
                  {emp.primaryManager || '-'}
                </TableCell>
                <TableCell className={emp.status === 'VALIDATED' ? 'text-green-600' : 'text-red-600'}>
                  {emp.status}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="pt-2 pr-2">
        <Pagination
          page={page}
          totalPages={Math.ceil(filteredData.length / recordsPerPage)}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};


export default EmployeeTable;