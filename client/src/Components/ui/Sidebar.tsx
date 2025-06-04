// components/ui/Sidebar.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Home, Building2, GitBranch, Users, Clock, Calendar,
  FileText, CalendarDays, Workflow, Mail, CheckSquare,
} from 'lucide-react';

const navigation = [
  { name: "Dashboard", icon: Home, path: "/" },
  { name: "Company", icon: Building2, path: "/company" },
  { name: "Branch", icon: GitBranch, path: "/branch" },
  { name: "Import Employees", icon: Users, path: "/import-employees" },
  { name: "Work Schedule", icon: Clock, path: "/work-schedule" },
  { name: "Attendance Policy", icon: Calendar, path: "/attendance-policy" },
  { name: "Leave Policy", icon: FileText, path: "/leave-policy" },
  { name: "Holiday", icon: CalendarDays, path: "/holiday" },
  { name: "Workflow Management", icon: Workflow, path: "/workflow-management" },
  { name: "SMTP Setup", icon: Mail, path: "/smtp-setup" },
  { name: "Approval Workflow", icon: CheckSquare, path: "/approval-workflow" },
];

interface SidebarProps {
  user: {
    name: string;
    email: string;
  };
  company : {
    companyName : string,
    companyId : string
  }
  onLogout: () => void;
}

export function Sidebar({ user, company }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;

  // Collapse sidebar if not on dashboard
  const isCollapsed = pathname !== "/";

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <aside className={`fixed min-h-screen bg-white border-r flex flex-col justify-between transition-all duration-200`}>
      <div>
        <div className={`flex items-center gap-2 p-4 border-b ${isCollapsed ? 'justify-center' : ''}`}>
          {/* Logo: show icon only when collapsed, icon+text when expanded */}
          <span className="flex items-center">
            {/* Example SVG logo, replace with your logo as needed */}
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              viewBox="0 0 32 32"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="16" cy="16" r="14" />
              <text x="16" y="21" textAnchor="middle" fontSize="14" fill="currentColor" fontFamily="Arial">C</text>
            </svg>
            {!isCollapsed && (
              <span className="font-bold text-blue-600 ml-2">{company.companyName}</span>
            )}
          </span>
        </div>

        <nav className="flex flex-col p-">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              //adjust padding to increase gap b/w items
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-left transition-all duration-200 ${
                pathname === item.path ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className="h-6 w-6" />
              {!isCollapsed && <span>{item.name}</span>}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
