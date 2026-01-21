import React, { useState } from "react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCustomer = {
      id: Date.now(),
      ...formData,
    };
    setCustomers((prev) => [...prev, newCustomer]);
    setFormData({ name: "", email: "", phone: "", address: "" });
    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8 animate-slide-down">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Customers</h1>
        <button
          className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:-translate-y-0.5 hover:from-gray-900 hover:to-black transition-all duration-300"
          onClick={() => setIsFormOpen(true)}
        >
          + Add Customer
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Customer</h2>
              <button
                className="text-3xl text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-300"
                onClick={() => setIsFormOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
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
              <div className="mb-5">
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
              <div className="mb-5">
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
              <div className="mb-5">
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
              <div className="flex gap-4 justify-end mt-6">
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 hover:shadow-md transition-all duration-300"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-fade-in">
        <table className="w-full">
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
            {customers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-400 italic py-10">
                  No customers found. Add your first customer!
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-all duration-300 border-b border-gray-100">
                  <td className="px-5 py-4 border-b border-gray-100 text-gray-700">{customer.name}</td>
                  <td className="px-5 py-4 border-b border-gray-100 text-gray-700">{customer.email}</td>
                  <td className="px-5 py-4 border-b border-gray-100 text-gray-700">{customer.phone}</td>
                  <td className="px-5 py-4 border-b border-gray-100 text-gray-700">{customer.address}</td>
                  <td className="px-5 py-4 border-b border-gray-100">
                    <button
                      className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-800 hover:shadow-md transition-all duration-300"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
