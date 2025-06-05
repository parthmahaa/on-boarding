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
import Company from './Components/SidebarPages/Company/Company';
import Branch from './Components/SidebarPages/Branch/Branch';
import WorkSchedule from './Components/SidebarPages/WorkSchedule';
import AttendancePolicy from './Components/SidebarPages/AttendancePolicy';
import LeavePolicy from './Components/SidebarPages/LeavePolicy';
import Holiday from './Components/SidebarPages/Holiday';
import WorkflowManagement from './Components/SidebarPages/WorkflowManagement';
import CollectEmployee from './Components/Employees/CollectEmployee';
import ApprovalWorkflow from './Components/SidebarPages/ApprovalWorkflow';
import SmtpSetup from './Components/SidebarPages/SmtpSetup';

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
          <Route path="/c/:params" element={<CollectEmployee/>} />
          <Route element={<Layout />}>
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
            <Route path="/approval-workflow" element={<ApprovalWorkflow/>} />
            <Route path="/smtp-setup" element={<SmtpSetup/>} />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
