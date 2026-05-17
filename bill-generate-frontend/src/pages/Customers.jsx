import React, { useState, useEffect } from "react";
import customerService from "../controller/customerService";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      alert("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await customerService.update(editingId, formData);
      } else {
        await customerService.create(formData);
      }
      setFormData({ name: "", email: "", phone: "", address: "" });
      setEditingId(null);
      setIsFormOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Failed to create customer");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await customerService.delete(id);
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Failed to delete customer");
    }
  };
  const handleEdit = (id) => {
    // Load customer data and open form in edit mode
    (async () => {
      try {
        const data = await customerService.getById(id);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
        setEditingId(id);
        setIsFormOpen(true);
      } catch (error) {
        console.error("Error loading customer for edit:", error);
        alert("Failed to load customer for editing");
      }
    })();
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading customers...</div>
      </div>
    );
  }

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (customer.name || "").toLowerCase().includes(q) ||
      (customer.email || "").toLowerCase().includes(q) ||
      (customer.phone || "").toLowerCase().includes(q) ||
      (customer.address || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-slide-down">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Customers</h1>
        <button
          className="mt-4 md:mt-0 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 md:px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:-translate-y-0.5 hover:from-blue-900 hover:to-blue-900 transition-all duration-300"
          onClick={() => setIsFormOpen(true)}
        >
          + Add Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 animate-fade-in">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search customers by name, email, phone or address..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              ✕
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-xs text-gray-500 mt-2 ml-1">
            Found <span className="font-semibold">{filteredCustomers.length}</span> result{filteredCustomers.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Customer' : 'Add New Customer'}</h2>
              <button
                className="text-3xl text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-300"
                onClick={() => { setIsFormOpen(false); setEditingId(null); setFormData({ name: "", email: "", phone: "", address: "" }); }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block mb-2 text-gray-700 font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter customer name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700 font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700 font-medium">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-gray-700 font-medium">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter address"
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all duration-300 resize-none"
                    />
                  </div>
                </div>
              <div className="flex flex-col md:flex-row gap-3 justify-end mt-6">
                <button
                  type="button"
                  className="w-full md:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 hover:shadow-md transition-all duration-300"
                  onClick={() => { setIsFormOpen(false); setEditingId(null); setFormData({ name: "", email: "", phone: "", address: "" }); }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg font-medium hover:from-blue-900 hover:to-blue-900 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                >
                  {editingId ? 'Update Customer' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] md:min-w-full w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Name</th>
                <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Email</th>
                <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Phone</th>
                <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Address</th>
                <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 italic py-10">
                    {searchQuery ? "No customers match your search." : "No customers found. Add your first customer!"}
                  </td>
                </tr>
              ) : (
                (() => {
                  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
                  const safePage = Math.min(currentPage, totalPages || 1);
                  const startIndex = (safePage - 1) * itemsPerPage;
                  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
                  return paginatedCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-all duration-300 border-b border-gray-100">
                      <td className="px-5 py-4 border-b border-gray-100 text-gray-700">{customer.name}</td>
                      <td className="px-5 py-4 border-b border-gray-100 text-gray-700">{customer.email}</td>
                      <td className="px-5 py-4 border-b border-gray-100 text-gray-700">{customer.phone}</td>
                      <td className="px-5 py-4 border-b border-gray-100 text-gray-700">{customer.address}</td>
                      <td className="px-5 py-4 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row gap-2">
                          <button
                            className="w-full md:w-auto px-4 py-2 bg-gray-700 text-white rounded-md text-sm hover:bg-green-900 hover:shadow-md transition-all duration-300"
                            onClick={() => handleEdit(customer.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="w-full md:w-auto px-4 py-2 bg-red-700 text-white rounded-md text-sm hover:bg-red-800 hover:shadow-md transition-all duration-300"
                            onClick={() => handleDelete(customer.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ));
                })()
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {(() => {
          const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
          const safePage = Math.min(currentPage, totalPages || 1);
          const startIndex = (safePage - 1) * itemsPerPage;
          const endIndex = Math.min(startIndex + itemsPerPage, filteredCustomers.length);
          if (totalPages <= 1) return null;
          return (
            <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{startIndex + 1}</span> to <span className="font-semibold">{endIndex}</span> of <span className="font-semibold">{filteredCustomers.length}</span> customers
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={safePage === 1}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300"
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        safePage === page
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={safePage === totalPages}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Next →
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default Customers;
