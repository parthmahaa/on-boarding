import React from 'react';
import {Plus} from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../services/api';
import CollectEmployeePopup from './CollectEmployeePopup';

const ImportEmployees: React.FC = () => {
    const navigate = useNavigate();

    // Decrypt onboarding user from local storage
    function decrypt(data: string) {
        try {
            return JSON.parse(decodeURIComponent(atob(data)));
        } catch {
            return null;
        }
    }

    const companyDetailsRaw = localStorage.getItem('companyDetails');
    const companyDetails = companyDetailsRaw ? decrypt(companyDetailsRaw) : null;
    const companyId = companyDetails?.companyId;

    console.log("Company ID:", companyId);

    const handleAddEmp = () => {
        if (companyId) {
            navigate(`/addEmployee/${companyId}`);
        }
        // Optionally handle the case where companyId is not available
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
            <div className="flex justify-end gap-3 bg-white rounded-md">
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
            {showPopup && publicUrl && (
                <CollectEmployeePopup url={publicUrl} onClose={() => setShowPopup(false)} />
            )}
            {loading && <div className="mt-2 text-blue-600">Loading...</div>}
            {error && <div className="mt-2 text-red-500">{error}</div>}
        </>
    );
};

export default ImportEmployees;
