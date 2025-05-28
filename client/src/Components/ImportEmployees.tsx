import React from 'react';
import {Plus, Trash2} from 'lucide-react'

const ImportEmployees: React.FC = () => {
    return (
        <>
            <div className="flex justify-end gap-3 bg-white rounded-md">
                <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
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
