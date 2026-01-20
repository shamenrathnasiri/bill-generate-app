import React, { useState } from "react";

const Services = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
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
    const newService = {
      id: Date.now(),
      ...formData,
      price: parseFloat(formData.price),
    };
    setServices((prev) => [...prev, newService]);
    setFormData({ name: "", description: "", price: "" });
    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Services</h1>
        <button
          className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-200"
          onClick={() => setIsFormOpen(true)}
        >
          + Add Service
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Add New Service</h2>
              <button
                className="text-3xl text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setIsFormOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block mb-2 text-gray-700 font-medium">Service Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter service name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-gray-700 font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter service description"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-gray-700 font-medium">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div className="flex gap-4 justify-end mt-6">
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-white rounded-lg font-medium hover:-translate-y-0.5 hover:shadow-lg transition-all"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-10 text-center shadow-lg">
            <p className="text-gray-400 italic">No services found. Add your first service!</p>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-800">{service.name}</h3>
                <span className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ${service.price.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-500 mb-5 leading-relaxed">
                {service.description || "No description"}
              </p>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
                  onClick={() => handleDelete(service.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Services;
