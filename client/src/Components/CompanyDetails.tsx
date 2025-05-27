import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { useEffect } from 'react';

export default function CompanyPage() {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("isLoggedIn") !== "true") {
            navigate("/");
        }
    }, [navigate]);
    const user = {
        name: 'John Doe',
        email: 'john@example.com',
    };

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/");
    };

    return (
        <DashboardLayout user={user} onLogout={handleLogout}>
            <h1 className="text-2xl font-semibold mb-4">Company Management</h1>
            <p className="text-gray-500">Manage your company settings and information here.</p>
        </DashboardLayout>
    );
}
