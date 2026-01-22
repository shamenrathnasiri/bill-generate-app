import React, { useState, useEffect } from "react";
import billService from "../controller/billService";
import customerService from "../controller/customerService";

const Reports = () => {
  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [billsData, customersData] = await Promise.all([
        billService.getAll(),
        customerService.getAll(),
      ]);
      setBills(billsData);
      setCustomers(customersData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setDateRange({ startDate: "", endDate: "" });
    setStatusFilter("all");
    setPage(1);
  };

  // Filter bills by date range first
  const dateFilteredBills = bills.filter((bill) => {
    if (!dateRange.startDate && !dateRange.endDate) return true;
    const billDate = new Date(bill.date);
    const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
    const end = dateRange.endDate ? new Date(dateRange.endDate) : null;

    if (start && end) {
      return billDate >= start && billDate <= end;
    } else if (start) {
      return billDate >= start;
    } else if (end) {
      return billDate <= end;
    }
    return true;
  });

  // Status filter (all, paid, unpaid)
  const filteredBills = dateFilteredBills.filter((bill) => {
    if (statusFilter === "paid") return bill.is_paid;
    if (statusFilter === "unpaid") return !bill.is_paid;
    return true;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredBills.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedBills = filteredBills.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Separate paid and unpaid bills (after date filter only) for totals
  const paidBills = dateFilteredBills.filter((bill) => bill.is_paid);
  const unpaidBills = dateFilteredBills.filter((bill) => !bill.is_paid);

  // Calculate totals
  const totalPaid = paidBills.reduce((sum, bill) => sum + Number(bill.total), 0);
  const totalUnpaid = unpaidBills.reduce((sum, bill) => sum + Number(bill.total), 0);
  const grandTotal = totalPaid + totalUnpaid;

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, dateRange.startDate, dateRange.endDate]);

  // Get customer name helper
  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : "Unknown";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading reports...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-slide-down">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Reports</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6 animate-fade-in">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition"
            >
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Paid */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Total Paid</p>
              <p className="text-3xl font-bold mt-1">Rs. {totalPaid.toFixed(2)}</p>
              <p className="text-green-100 text-sm mt-2">{paidBills.length} invoice(s)</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Unpaid */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium uppercase tracking-wide">Total Unpaid</p>
              <p className="text-3xl font-bold mt-1">Rs. {totalUnpaid.toFixed(2)}</p>
              <p className="text-red-100 text-sm mt-2">{unpaidBills.length} invoice(s)</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
        </div>

        {/* Grand Total */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-lg p-6 text-white animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm font-medium uppercase tracking-wide">Grand Total</p>
              <p className="text-3xl font-bold mt-1">Rs. {grandTotal.toFixed(2)}</p>
              <p className="text-slate-300 text-sm mt-2">{filteredBills.length} invoice(s)</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Single Table for Paid/Unpaid */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Invoices
          </h2>
          <div className="flex items-center gap-3 text-slate-200 text-sm">
            <div className="flex items-center gap-2">
              <span>Rows</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-slate-700 text-white border border-slate-500 rounded px-2 py-1 text-xs"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <span>{filteredBills.length} record(s)</span>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[520px]">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">Invoice No.</th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">Customer</th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">Status</th>
                <th className="px-4 py-3 text-right text-gray-600 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-400 italic py-10">
                    No invoices found for the selected filters
                  </td>
                </tr>
              ) : (
                paginatedBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`font-mono px-2 py-1 rounded text-xs font-bold ${bill.is_paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {bill.bill_number}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{bill.customer_name || getCustomerName(bill.customer_id)}</td>
                    <td className="px-4 py-3 text-gray-700">{bill.date}</td>
                    <td className="px-4 py-3 text-gray-700">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bill.is_paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {bill.is_paid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">Rs. {Number(bill.total).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredBills.length > 0 && (
              <tfoot className="bg-slate-50 sticky bottom-0">
                <tr>
                  <td colSpan="4" className="px-4 py-3 font-bold text-gray-800">Total (filtered)</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">
                    Rs. {filteredBills.reduce((sum, bill) => sum + Number(bill.total), 0).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="5" className="px-4 py-3">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-700">
                      <span>Page {currentPage} of {totalPages}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded border ${currentPage === 1 ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-slate-300 text-slate-800 hover:bg-slate-100"}`}
                        >
                          Prev
                        </button>
                        <button
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded border ${currentPage === totalPages ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-slate-300 text-slate-800 hover:bg-slate-100"}`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
