// components/ui/Sidebar.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Home, Building2, GitBranch, Users, Clock, Calendar,
  FileText, CalendarDays, Workflow, HelpCircle, LogOut, ChevronDown
} from 'lucide-react';
import Avatar from './Avatar';

const navigation = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Company", icon: Building2, path: "/company" },
  { name: "Branch", icon: GitBranch, path: "/branch" },
  { name: "Import Employees", icon: Users, path: "/import-employees" },
  { name: "Work Schedule", icon: Clock, path: "/work-schedule" },
  { name: "Attendance Policy", icon: Calendar, path: "/attendance-policy" },
  { name: "Leave Policy", icon: FileText, path: "/leave-policy" },
  { name: "Holiday", icon: CalendarDays, path: "/holiday" },
  { name: "Workflow Management", icon: Workflow, path: "/workflow-management" },
  { name: "Other Details", icon: HelpCircle, path: "/other-details" },
];

interface SidebarProps {
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
}

export function Sidebar({ user, onLogout }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 p-4 border-b">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
            CL
          </div>
          <span className="font-bold text-blue-600">Company Logo</span>
        </div>

        <nav className="flex flex-col p-2">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 text-left ${
                pathname === item.path ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onLogout}>
          <Avatar name={user.name} />
          <div className="flex flex-col text-sm">
            <span className="font-semibold">{user.name}</span>
            <span className="text-gray-500 text-xs">{user.email}</span>
          </div>
          <ChevronDown className="ml-auto h-4 w-4 text-gray-500" />
        </div>
        <button
          className="mt-2 flex items-center text-red-600 hover:underline text-sm"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
