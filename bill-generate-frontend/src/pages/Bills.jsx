import React, { useState } from "react";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [formData, setFormData] = useState({
    customerName: "",
    serviceName: "",
    quantity: 1,
    unitPrice: "",
    date: new Date().toISOString().split("T")[0],
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
    const total = parseFloat(formData.unitPrice) * parseInt(formData.quantity);
    const newBill = {
      id: Date.now(),
      billNumber: `BILL-${Date.now().toString().slice(-6)}`,
      ...formData,
      quantity: parseInt(formData.quantity),
      unitPrice: parseFloat(formData.unitPrice),
      total,
    };
    setBills((prev) => [...prev, newBill]);
    setFormData({
      customerName: "",
      serviceName: "",
      quantity: 1,
      unitPrice: "",
      date: new Date().toISOString().split("T")[0],
    });
    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    setBills((prev) => prev.filter((bill) => bill.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8 animate-slide-down">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Bills</h1>
        <button
          className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:-translate-y-0.5 hover:from-blue-900 hover:to-blue-900 transition-all duration-300"
          onClick={() => setIsFormOpen(true)}
        >
          + Create Bill
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create New Bill</h2>
              <button
                className="text-3xl text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-300"
                onClick={() => setIsFormOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block mb-2 text-gray-700 font-medium">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter customer name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-gray-700 font-medium">Service Name</label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter service name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all duration-300"
                />
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
                    name="unitPrice"
                    value={formData.unitPrice}
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
                  Rs. {((parseFloat(formData.unitPrice) || 0) * (parseInt(formData.quantity) || 0)).toFixed(2)}
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
                  Create Bill
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
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Bill No.</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Customer</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Service</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Qty</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Unit Price (Rs.)</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Total</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Date</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-gray-400 italic py-10">
                  No bills found. Create your first bill!
                </td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50 transition-all duration-300 border-b border-gray-100">
                  <td className="px-5 py-4 border-b border-gray-100">
                    <span className="font-mono bg-gray-200 text-gray-900 px-2 py-1 rounded font-bold">
                      {bill.billNumber}
                    </span>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-100 text-gray-700">{bill.customerName}</td>
                  <td className="px-5 py-4 border-b border-gray-100 text-gray-700">{bill.serviceName}</td>
                  <td className="px-5 py-4 border-b border-gray-100 text-gray-700">{bill.quantity}</td>
                  <td className="px-5 py-4 border-b border-gray-100 text-gray-700">RS. {bill.unitPrice.toFixed(2)}</td>
                  <td className="px-5 py-4 border-b border-gray-100 font-bold text-gray-900">RS. {bill.total.toFixed(2)}</td>
                  <td className="px-5 py-4 border-b border-gray-100 text-gray-700">{bill.date}</td>
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
