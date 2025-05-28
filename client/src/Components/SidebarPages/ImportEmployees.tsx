import React from 'react';
import {Plus} from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const ImportEmployees: React.FC = () => {

    const companyId = '6b2d2e20-a25f-4bdb-9620-ef86c274b810'

    const navigate = useNavigate()
    const handleAddEmp = () =>{
        navigate(`/addEmployee/${companyId}`)
    }

    return (
        <>
            <div className="flex justify-end gap-3 bg-white rounded-md">
                <button onClick={handleAddEmp} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
                    <Plus size={15} />
                    Add Employee
                </button>

                <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
                    <Plus size={15} />
                    Import Excel
                </button>

                <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
                    <Plus size={15} />
                    Collect Employees
                </button>
            </div>

        </>
    );
};

export default ImportEmployees;
