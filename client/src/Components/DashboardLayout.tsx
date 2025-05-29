import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Breadcrumbs from './ui/Breadcrumbs';
import Sidebar from './ui/Sidebar';
import Avatar from './ui/Avatar';

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
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isDashboard ? 'w-72' : 'w-20'} bg-white shadow-md rounded-r-2xl transition-all duration-200`}>
        <Sidebar user={user} onLogout={onLogout} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-200">
        <header className="flex justify-between px-6 py-4 border-b bg-white shadow-sm">
          <Breadcrumbs />
          <Avatar name={user.name} email={user.email} />
        </header>

        <main className="flex-1 p-6 space-y-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
