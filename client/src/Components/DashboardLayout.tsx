import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from './ui/Breadcrumbs';
import Sidebar from './ui/Sidebar';
import Avatar from './ui/Avatar';
import { decrypt } from '../utilities/encrypt';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
}

export default function DashboardLayout({ user, onLogout }: DashboardLayoutProps) {
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  const navigate = useNavigate()
  
  let userDetails : any = null
  let companyDetails : any = null
  try{
    const userDetailsRaw = localStorage.getItem('userDetails')
    userDetails = userDetailsRaw ? (decrypt(userDetailsRaw)) : null
    const companyDetailsRaw = localStorage.getItem('companyDetails')
    companyDetails = companyDetailsRaw ? (decrypt(companyDetailsRaw)) : null

    // console.log(userDetails);
    // console.log(companyDetails);
  }catch(e){
    userDetails = null
    companyDetails = null
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isDashboard ? 'w-72' : 'w-20'} bg-white shadow-md rounded-r-2xl transition-all duration-200`}>
      <Sidebar user={userDetails} company={companyDetails}  onLogout={onLogout} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-200">
        <header className="flex justify-between items-center px-6 py-4 border-b bg-white shadow-sm">
          <Breadcrumbs/>
          <div className="flex items-center gap-4">
            <button
              className="w-auto text-red-500 rounded-md p-2 hover:bg-red-50 transition-colors"
              onClick={() => {
                localStorage.clear();
                navigate('/login')
              }}
            >
              Logout
            </button>
            <Avatar name={userDetails.name} email={userDetails.email} />
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
