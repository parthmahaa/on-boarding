import React from 'react';
import {Plus} from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../services/api';
import CollectEmployeePopup from './CollectEmployeePopup';
import { decrypt } from '../../utilities/encrypt';
import EmployeeTable from '../Employees/EmployeeList';

const ImportEmployees: React.FC = () => {
    const navigate = useNavigate();

    let userDetails : any = null
    let companyDetails : any = null
    try{
        const userDetailsRaw = localStorage.getItem('userDetails')
        userDetails = userDetailsRaw ? (decrypt(userDetailsRaw)) : null
        const companyDetailsRaw = localStorage.getItem('companyDetails')
        companyDetails = companyDetailsRaw ? (decrypt(companyDetailsRaw)) : null
    }catch(e){
        userDetails = null
        companyDetails = null
    }

    // Defensive check to avoid errors if companyDetails is null or malformed
    const companyId = companyDetails && companyDetails.companyId ? companyDetails.companyId : '';
    const companyName = companyDetails && companyDetails.companyName ? companyDetails.companyName : '';

    const handleAddEmp = () => {
        if (companyId) {
            navigate(`/addEmployee/${companyId}`);
        } else {
            alert('Company ID not found.');
        }
    }

    const [showPopup, setShowPopup] = React.useState(false);
    const [publicUrl, setPublicUrl] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleCollectEmp = async () => {
        if (!companyId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/company/${companyId}`);
            if (!res.ok) throw new Error('Failed to fetch public URL');
            const result = await res.json();
            if(result.data?.publicUrl){
                setPublicUrl("http://localhost:5173/c/"+result.data?.publicUrl);
            }
            setShowPopup(true);
        } catch (err: any) {
            setError(err.message || 'Error fetching public URL');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex justify-end gap-3 bg-gray-50 rounded-md">
                <button onClick={handleAddEmp} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
                    <Plus size={15} />
                    Add Employee
                </button>

                <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
                    <Plus size={15} />
                    Import Excel
                </button>

                <button onClick={handleCollectEmp} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
                    <Plus size={15} />
                    Collect Employees
                </button>
            </div>
            <div className='pt-2'>
                <EmployeeTable data={[]} companyId={companyId}/>
            </div>
            {showPopup && publicUrl && (
                <CollectEmployeePopup url={publicUrl} onClose={() => setShowPopup(false)} />
            )}
            {loading && <div className="mt-2 text-blue-600">Loading...</div>}
            {error && <div className="mt-2 text-red-500">{error}</div>}
        </>
    );
};

export default ImportEmployees;
