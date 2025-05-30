import './App.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, Outlet, useParams } from 'react-router-dom';
import OnboardingForm from './Components/OnBoardingForm';
import Admin from './Components/Admin/Admin';
import Login from './Components/Login';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import { AlertTriangle, Lock } from 'lucide-react';
import ViewEmployees from './Components/Admin/ViewEmployees';
import DashboardLayout from './Components/DashboardLayout';
import AddEmployee from './Components/Employees/AddEmployee';
// Import all sidebar page components
import Company from './Components/SidebarPages/Company';
import Branch from './Components/SidebarPages/Branch';
import WorkSchedule from './Components/SidebarPages/WorkSchedule';
import AttendancePolicy from './Components/SidebarPages/AttendancePolicy';
import LeavePolicy from './Components/SidebarPages/LeavePolicy';
import Holiday from './Components/SidebarPages/Holiday';
import WorkflowManagement from './Components/SidebarPages/WorkflowManagement';
import OtherDetails from './Components/SidebarPages/OtherDetails';
import CollectEmployee from './Components/Employees/CollectEmployee';
import React, { useEffect, useState } from 'react';
import LoaderRings from './utilities/Loader';

function Layout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <Outlet />
      </main>
    </>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h2 className="text-3xl font-bold mb-2">404 - Page Not Found</h2>
      <p className="text-gray-500 mb-4">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="text-blue-600 hover:underline">Go to Home</a>
    </div>
  );
}

function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Lock className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-3xl font-bold mb-2">401 - Unauthorized</h2>
      <p className="text-gray-500 mb-4">You do not have permission to view this page.</p>
      <a href="/login" className="text-blue-600 hover:underline">Login</a>
    </div>
  );
}

// Wrapper for /c/:params to verify path before rendering CollectEmployee
const CollectEmployeeWrapper: React.FC = () => {
  const { params } = useParams<{ params: string }>();
  const [verified, setVerified] = useState<null | boolean>(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/${params}`);
        const result = await response.json();
        setVerified(response.ok && !result.error);
      } catch {
        setVerified(false);
      }
    };
    if (params) verify();
    else setVerified(false);
  }, [params]);

  if (verified === null) {
    return <div className="text-center py-10"><LoaderRings/></div>;
  }
  if (!verified) {
    return(
      <div className='text-center text-2xl pt-5'>
        The link is invalid
      </div>
    );
  }
  return <CollectEmployee />;
};

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        limit={1}
        style={{ zIndex: 9999 }}
      />
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/c/:params" element={<CollectEmployeeWrapper />} />
            <Route path="/form" element={<OnboardingForm />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/viewEmployees/:companyId" element={<ViewEmployees />} />
          <Route path="/login" element={<Login />} />
          {/* Sidebar navigation routes */}
          <Route
            element={
              <DashboardLayout
                user={{ name: 'John Doe', email: 'john@example.com' }}
                onLogout={() => { console.log('User logged out'); }}
              >
                <Outlet />
              </DashboardLayout>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/company" element={<Company />} />
            <Route path="/branch" element={<Branch />} />
            <Route path="/import-employees" element={<Home isImportEmployees />} />
            <Route path="/work-schedule" element={<WorkSchedule />} />
            <Route path="/attendance-policy" element={<AttendancePolicy />} />
            <Route path="/addEmployee/:companyId" element={<AddEmployee />} />
            <Route path="/leave-policy" element={<LeavePolicy />} />
            <Route path="/holiday" element={<Holiday />} />
            <Route path="/workflow-management" element={<WorkflowManagement />} />
            <Route path="/other-details" element={<OtherDetails />} />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
