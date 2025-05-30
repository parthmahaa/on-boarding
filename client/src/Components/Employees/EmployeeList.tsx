import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Table, TableHead, TableRow, TableCell, TableBody } from '../ui/Table';
import { Input } from '../ui/Input';
import { Pagination } from '../ui/Pagination';
import AddEmployeeForm from './AddEmployee';
import { Download, Filter } from 'lucide-react';


interface Employee {
  name: string;
  id: string;
  joiningDate: string;
  createdDate: string;
  email: string;
  sbu: string;
  branch: string;
  department: string;
  designation: string;
  primaryManager: string;
}

interface EmployeeTableProps {
  data: Employee[];
}

const validateEmployee = (employee: Employee): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dateRegex = /^\d{2}-[A-Za-z]{3}-\d{4}$/;

  return (
    employee.name !== '' &&
    emailRegex.test(employee.email) &&
    dateRegex.test(employee.joiningDate) &&
    dateRegex.test(employee.createdDate) &&
    employee.primaryManager !== ''
  );
};

const EmployeeTable: React.FC<EmployeeTableProps> = ({ data }) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const recordsPerPage = 25;
  const filteredData = data.filter((emp) =>
    emp.name.toLowerCase().includes(filter.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <Button onClick={() => setShowForm(true)}>+ Add Employee</Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-1" /> Export
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-1" /> Filter
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
                  <div className="font-semibold">{emp.name}</div>
                  <div className="text-sm text-gray-500">{emp.id}</div>
                </TableCell>
                <TableCell>
                  <div>{emp.joiningDate}</div>
                  <div className="text-sm text-gray-500">{emp.createdDate}</div>
                </TableCell>
                <TableCell className={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emp.email) ? 'text-red-600' : ''}>{emp.email}</TableCell>
                <TableCell>{emp.sbu}</TableCell>
                <TableCell>{emp.branch}</TableCell>
                <TableCell>{emp.department}</TableCell>
                <TableCell>{emp.designation}</TableCell>
                <TableCell className={!emp.primaryManager ? 'text-red-600' : ''}>{emp.primaryManager}</TableCell>
                <TableCell className={isValid ? 'text-green-600' : 'text-red-600'}>
                  {isValid ? 'Validated' : 'Issues'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="mt-4">
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
