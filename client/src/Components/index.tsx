import { useState } from "react";
import { Sidebar } from "./Sidebar";

const DashboardLayout = () => {
  const [fullName] = useState("John Doe");

  const firstInitial = fullName.split(" ")[0]?.charAt(0) || "";
  const lastInitial = fullName.split(" ")[1]?.charAt(0) || "";

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 w-full bg-white shadow px-6 py-4 z-10 flex items-center justify-end border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
              {firstInitial}
              {lastInitial}
            </div>
            <span className="font-semibold text-gray-800">{fullName}</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-semibold mb-4">Welcome to the Dashboard</h1>
          <p>This is your main content area.</p>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
