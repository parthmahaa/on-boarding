import React from 'react';
import { useLocation } from 'react-router-dom';
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

export default function DashboardLayout({ children, user, onLogout }: DashboardLayoutProps) {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-white shadow-md rounded-r-2xl min-w-[240px]">
        <Sidebar user={user} onLogout={onLogout} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
          <Breadcrumbs />
          <Avatar name={user.name} email={user.email} />
        </header>

        <main className="flex-1 p-6 space-y-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
