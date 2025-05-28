import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../services/api";
import type { Employee, ApiResponse } from "../../utilities/types";
import Navbar from "../Navbar";

const ViewEmployees: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/admin/getEmployeeDetails/${companyId}`);
        if (!response.ok) throw new Error("Failed to fetch employees");
        const result: ApiResponse = await response.json();
        setEmployees(result.data || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    if (companyId) fetchEmployees();
  }, [companyId]);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Employees</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && employees.length === 0 && (
          <p>No employees found for this company.</p>
        )}
        {!loading && !error && employees.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Branch</th>
                <th className="px-4 py-2 text-left">Roles</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td className="px-4 py-2">{emp.fullName || `${emp.firstName} ${emp.lastName}`}</td>
                  <td className="px-4 py-2">{emp.email}</td>
                  <td className="px-4 py-2">{emp.phone || "NA"}</td>
                  <td className="px-4 py-2">{emp.branch || "NA"}</td>
                  <td className="px-4 py-2">{emp.roles?.join(", ") || "NA "}</td>
                  <td className="px-4 py-2">{emp.status || "NA"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ViewEmployees;
