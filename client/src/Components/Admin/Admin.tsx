import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { toast } from "react-toastify";
import type { Company, ApiResponse } from "../../utilities/types";
import { API_URL } from "../../services/api";

const Admin: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(
          `${API_URL}/admin/getCompanies?includeEmployees=true`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();
        setCompanies(result.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Skeleton loader for company card
  const CompanySkeleton = () => (
    <div className="min-w-[320px] max-w-xs flex-shrink-0 p-6 bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-2xl shadow-lg border border-gray-200 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );

  // Helper for status badge
  const getStatusBadge = (status: string) => {
    let color = "";
    let text = "";
    switch (status) {
      case "CREATED":
        color = "bg-gray-200 text-blue-500";
        text = "Created";
        break;
      case "IN_PROGRESS":
        color = "bg-yellow-100 text-yellow-700";
        text = "In Progress";
        break;
      case "DROPPED":
        color = "bg-red-100 text-red-700";
        text = "Dropped";
        break;
      default:
        color = "bg-gray-100 text-gray-500";
        text = status;
    }
    return (
      <span className={`px-2 py-0.5 rounded text-sm font-semibold ${color}`}>
        {text}
      </span>
    );
  };

  // Handler for row click
  const handleRowClick = (idx: number) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  // Handler for "View" button
  const handleView = (company: Company) => {
    toast.info(`Viewing employees for ${company.companyName}`);
    // You can navigate to a detailed view here
  };

  // Handler for "Drop" button
  const handleDrop = async (company: Company) => {
    if (!window.confirm(`Are you sure you want to drop ${company.companyName}?`))
      return;
    setDeletingId(company.id);
    try {
      const response = await fetch(
        `${API_URL}/admin/deleteCompany/${company.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete company");
      setCompanies((prev) => prev.filter((c) => c.id !== company.id));
      toast.success("Company dropped successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to drop company");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-left mb-6">Company List</h1>

          {loading && <p className="text-center text-blue-500">Loading...</p>}
          {error && <p className="text-center text-red-500">Error: {error}</p>}

          {/* Horizontal scrollable company cards */}
          <div className="overflow-x-auto rounded-2xl shadow-lg bg-white border border-gray-200">
            <table className="min-w-full divide-y-2 divide-gray-200 rounded-2xl overflow-hidden">
              <thead className="bg-blue-50 sticky top-0 z-10 ltr:text-left rtl:text-right">
                <tr className="*:font-semibold *:text-blue-900">
                  <th className="px-6 py-3 whitespace-nowrap">Company Name</th>
                  <th className="px-6 py-3 whitespace-nowrap">GST Number</th>
                  <th className="px-6 py-3 whitespace-nowrap">No of Employees</th>
                  <th className="px-6 py-3 whitespace-nowrap w-72">Address</th>
                  <th className="px-6 py-3 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              {!loading && !error && companies.length === 0 ? (
                <p className="text-gray-600 p-3 text-center">No companies found.</p>
              ) : (<tbody className="divide-y divide-gray-100">
                {companies.map((company, idx) => (
                  <React.Fragment key={company.id ?? idx}>
                    <tr
                      className="*:text-gray-900 *:first:font-medium even:bg-blue-50/40 hover:bg-blue-100/60 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(idx)}
                    >
                      <td className="px-6 py-3 whitespace-nowrap">
                        {company.companyName}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        {company.gstRegistrationNumber}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        {company.noOfEmployees}
                      </td>
                      <td className="px-6 py-3 max-w-xs break-words whitespace-pre-line">
                        {company.address}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        {getStatusBadge(company.companyStatus)}
                      </td>
                    </tr>
                    //dropdown
                    <tr>
                      <td colSpan={5} className="p-0 border-none">
                        <div
                          className={`transition-all duration-300 overflow-hidden ${expandedIdx === idx
                              ? "max-h-32 opacity-100 py-4"
                              : "max-h-0 opacity-0 py-0"
                            } bg-blue-50/60 flex gap-4 justify-items-start px-8`}
                          style={{
                            borderRadius:
                              expandedIdx === idx ? "0 0 1rem 1rem" : undefined,
                          }}
                        >
                          {expandedIdx === idx && (
                            <>
                              <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleView(company);
                                }}
                              >
                                View
                              </button>
                              <button
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition disabled:opacity-60"
                                disabled={deletingId === company.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDrop(company);
                                }}
                              >
                                {deletingId === company.id ? "Dropping..." : "Drop"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>)}

            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;