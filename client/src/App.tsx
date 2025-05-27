import './App.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import OnboardingForm from './Components/OnBoardingForm';
import Admin from './Components/Admin/Admin';
import Login from './Components/Login';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import { AlertTriangle, Lock } from 'lucide-react';
import ViewEmployees from './Components/Admin/ViewEmployees';

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
      <a href="/home" className="text-blue-600 hover:underline">Go to Home</a>
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
          <Route element={<Layout />}>
            <Route path="/" element={<OnboardingForm />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/viewEmployees/:companyId" element={<ViewEmployees />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
