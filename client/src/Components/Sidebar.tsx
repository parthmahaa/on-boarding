import {
  Bars3Icon,
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ClockIcon,
  ArrowsRightLeftIcon,
  CalendarDaysIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const navigation = [
    { name: "Dashboard", icon: HomeIcon },
    { name: "Company", icon: UserIcon },
    { name: "Branch", icon: BriefcaseIcon },
    { name: "Import Employees", icon: DocumentTextIcon },
    { name: "Work Schedule", icon: ClockIcon },
    { name: "Attendance Policy", icon: CalendarDaysIcon },
    { name: "Leave Policy", icon: ShoppingBagIcon },
    { name: "Holiday", icon: ShoppingBagIcon },
    { name: "Workflow Management", icon: ArrowsRightLeftIcon },
    { name: "Other Details", icon: QuestionMarkCircleIcon },
  ];

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        className="top-4 left-4 fixed  z-50 lg:hidden p-2 bg-white rounded-md shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bars3Icon className="h-6 w-6 text-gray-700" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full bg-white border-r transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64 p-6`}
      >
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-600">Company Logo</h2>
        </div>
        <nav className="space-y-2">
          {navigation.map((item) => (
            <button
              key={item.name}
              className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 w-full p-2 rounded-md transition"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Spacer for sidebar on large screens */}
      <div className="hidden lg:block lg:w-64"></div>
    </>
  );
};
