import React, { useState, useEffect } from "react";
import billService from "../controller/billService";
import customerService from "../controller/customerService";
import serviceService from "../controller/serviceService";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customer_id: "",
    service_id: "",
    quantity: 1,
    unit_price: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [billsData, customersData, servicesData] = await Promise.all([
        billService.getAll(),
        customerService.getAll(),
        serviceService.getAll(),
      ]);
      setBills(billsData);
      setCustomers(customersData);
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      
      // Auto-fill unit price when service is selected
      if (name === "service_id" && value) {
        const selectedService = services.find(s => s.id === parseInt(value));
        if (selectedService) {
          newData.unit_price = selectedService.price;
        }
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await billService.create({
        customer_id: parseInt(formData.customer_id),
        service_id: parseInt(formData.service_id),
        quantity: parseInt(formData.quantity),
        unit_price: parseFloat(formData.unit_price),
        date: formData.date,
      });
      setFormData({
        customer_id: "",
        service_id: "",
        quantity: 1,
        unit_price: "",
        date: new Date().toISOString().split("T")[0],
      });
      setIsFormOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error creating bill:", error);
      alert("Failed to create bill");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;
    try {
      await billService.delete(id);
      fetchData();
    } catch (error) {
      console.error("Error deleting bill:", error);
      alert("Failed to delete bill");
    }
  };

  const handleTogglePaid = async (id) => {
    try {
      await billService.togglePaid(id);
      fetchData();
    } catch (error) {
      console.error("Error toggling paid status:", error);
      alert("Failed to update paid status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8 animate-slide-down">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Invoices</h1>
        <button
          className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:-translate-y-0.5 hover:from-blue-900 hover:to-blue-900 transition-all duration-300"
          onClick={() => setIsFormOpen(true)}
        >
          + Create Invoice
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create New Invoice</h2>
              <button
                className="text-3xl text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-300"
                onClick={() => setIsFormOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block mb-2 text-gray-700 font-medium">Customer</label>
                <select
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-gray-700 font-medium">Service</label>
                <select
                  name="service_id"
                  value={formData.service_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - Rs. {service.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Unit Price (Rs.)</label>
                  <input
                    type="number"
                    name="unit_price"
                    value={formData.unit_price}
                    onChange={handleInputChange}
                    required
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-gray-700 font-medium">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg mt-5 border border-gray-200">
                <span className="text-gray-700 font-semibold">Total:</span>
                <span className="text-2xl font-bold text-gray-900">
                  Rs. {((parseFloat(formData.unit_price) || 0) * (parseInt(formData.quantity) || 0)).toFixed(2)}
                </span>
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
                  className="px-6 py-3 bg-gradient-to-r  from-slate-600 to-slate-700 text-white rounded-lg font-medium  hover:from-blue-900 hover:to-blue-900 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                >
                  Create Invoice
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
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Invoice No.</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Customer</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Service</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Qty</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Unit Price (Rs.)</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Total</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Date</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Status</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center text-gray-400 italic py-10">
                  No invoices found. Create your first invoice!
                </td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50 transition-all duration-300 border-b border-gray-100">
                  <td className="px-5 py-4 border-b border-gray-100">
                    <span className="font-mono bg-gray-200 text-gray-900 px-2 py-1 rounded font-bold">
                      {bill.bill_number}
                    </span>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-100 text-gray-700">{bill.customer_name}</td>
                  <td className="px-5 py-4 border-b border-gray-100 text-gray-700">{bill.service_name}</td>
                  <td className="px-5 py-4 border-b border-gray-100 text-gray-700">{bill.quantity}</td>
                  <td className="px-5 py-4 border-b border-gray-100 text-gray-700">Rs. {bill.unit_price.toFixed(2)}</td>
                  <td className="px-5 py-4 border-b border-gray-100 font-bold text-gray-900">Rs. {bill.total.toFixed(2)}</td>
                  <td className="px-5 py-4 border-b border-gray-100 text-gray-700">{bill.date}</td>
                  <td className="px-5 py-4 border-b border-gray-100">
                    <button
                      onClick={() => handleTogglePaid(bill.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                        bill.is_paid
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {bill.is_paid ? "Paid" : "Nonpaid"}
                    </button>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-100">
                    <button
                      className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-800 hover:shadow-md transition-all duration-300"
                      onClick={() => handleDelete(bill.id)}
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

export default Bills;
