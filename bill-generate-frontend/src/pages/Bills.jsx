import React, { useState, useEffect } from "react";
import billService from "../controller/billService";
import customerService from "../controller/customerService";
import serviceService from "../controller/serviceService";
import BillPDFModal from "../components/BillPDF";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customer_id: "",
    date: new Date().toISOString().split("T")[0],
    items: [],
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [itemDraft, setItemDraft] = useState({
    service_id: "",
    quantity: 1,
    unit_price: "",
  });
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [selectedBillForPDF, setSelectedBillForPDF] = useState(null);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDraftChange = (name, value) => {
    setItemDraft((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "service_id" && value) {
        const selectedService = services.find((s) => s.id === parseInt(value));
        if (selectedService) {
          next.unit_price = selectedService.price;
        }
      }
      return next;
    });
  };

  const handleAddItem = () => {
    if (!itemDraft.service_id) {
      alert("Select a service before adding.");
      return;
    }

    const quantity = parseInt(itemDraft.quantity, 10);
    if (!quantity || quantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    const unitPrice = parseFloat(itemDraft.unit_price);
    if (isNaN(unitPrice) || unitPrice < 0) {
      alert("Unit price must be a positive number.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          service_id: parseInt(itemDraft.service_id, 10),
          quantity,
          unit_price: unitPrice,
        },
      ],
    }));

    setItemDraft({
      service_id: "",
      quantity: 1,
      unit_price: "",
    });
  };

  const removeItemRow = (index) => {
    setFormData((prev) => {
      const items = prev.items.filter((_, i) => i !== index);
      return {
        ...prev,
        items,
      };
    });
  };

  const invoiceTotal = formData.items.reduce((sum, item) => {
    const qty = parseInt(item.quantity) || 0;
    const price = parseFloat(item.unit_price) || 0;
    return sum + qty * price;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      alert("Add at least one service to the invoice.");
      return;
    }
    try {
      const createdBill = await billService.create({
        customer_id: parseInt(formData.customer_id),
        date: formData.date,
        items: formData.items.map((item) => ({
          service_id: parseInt(item.service_id),
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price),
        })),
      });
      
      // Fetch the complete bill data with all details
      const billsData = await billService.getAll();
      setBills(billsData);
      
      // Find the newly created bill to show in PDF
      const newBill = billsData.find(b => b.id === createdBill.id);
      if (newBill) {
        // Add customer details to the bill for PDF
        const customer = customers.find(c => c.id === parseInt(formData.customer_id));
        const billWithDetails = {
          ...newBill,
          customer_email: customer?.email || "",
          customer_phone: customer?.phone || "",
          customer_address: customer?.address || "",
        };
        setSelectedBillForPDF(billWithDetails);
        setIsPDFModalOpen(true);
      }
      
      setFormData({
        customer_id: "",
        date: new Date().toISOString().split("T")[0],
        items: [],
      });
      setItemDraft({
        service_id: "",
        quantity: 1,
        unit_price: "",
      });
      setIsFormOpen(false);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-slide-down">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Invoices</h1>
        <button
          className="mt-4 md:mt-0 bg-linear-to-r from-slate-600 to-slate-700 text-white px-4 md:px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:-translate-y-0.5 hover:from-blue-900 hover:to-blue-900 transition-all duration-300"
          onClick={() => setIsFormOpen(true)}
        >
          + Create Invoice
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-16">
          <div className="flex w-full max-w-6xl max-h-[90vh] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between bg-slate-900 px-8 py-6 text-white">
              <div>
                <p className="text-sm uppercase tracking-wider text-slate-300">New invoice</p>
                <h2 className="text-2xl font-semibold">Create customer bill</h2>
              </div>
              <button
                className="text-3xl leading-none text-slate-300 transition-transform duration-300 hover:rotate-90 hover:text-white"
                onClick={() => setIsFormOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid flex-1 gap-8 overflow-y-auto bg-slate-50 px-8 pb-8 pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Customer</label>
                  <select
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="">Select customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Invoice date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Add services</h3>
                    <p className="text-sm text-slate-500">Pick a service, set quantity and rate, then add it to this invoice.</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-12">
                  <div className="md:col-span-6">
                    <label className="mb-1 block text-sm font-medium text-slate-600">Service</label>
                    <select
                      value={itemDraft.service_id}
                      onChange={(e) => handleDraftChange("service_id", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-inner outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                      <option value="">Select service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} - Rs. {service.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-600">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={itemDraft.quantity}
                      onChange={(e) => handleDraftChange("quantity", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-inner outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="mb-1 block text-sm font-medium text-slate-600">Unit price (Rs.)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={itemDraft.unit_price}
                      onChange={(e) => handleDraftChange("unit_price", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-inner outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="mt-6 max-h-64 overflow-y-auto pr-1">
                  {formData.items.length === 0 ? (
                    <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                      No services added yet. Use the form above to add the first one.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                      <table className="min-w-full table-auto divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-100 text-left uppercase tracking-wide text-slate-500">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Service</th>
                            <th className="px-4 py-3 font-semibold">Qty</th>
                            <th className="px-4 py-3 font-semibold">Unit price (Rs.)</th>
                            <th className="px-4 py-3 font-semibold">Line total (Rs.)</th>
                            <th className="px-4 py-3 font-semibold text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {formData.items.map((item, index) => {
                            const service = services.find((s) => s.id === Number(item.service_id));
                            const serviceName = service ? service.name : "Unknown service";
                            const serviceDescription = service?.description;
                            const quantity = item.quantity;
                            const unitPrice = Number(item.unit_price) || 0;
                            const lineTotal = unitPrice * Number(quantity);
                            return (
                              <tr key={`item-row-${index}`} className="align-top">
                                <td className="px-4 py-3">
                                  <div className="font-semibold text-slate-900">{serviceName}</div>
                                  {serviceDescription && (
                                    <div className="text-xs text-slate-500">{serviceDescription}</div>
                                  )}
                                </td>
                                <td className="px-4 py-3">{quantity}</td>
                                <td className="px-4 py-3">Rs. {unitPrice.toFixed(2)}</td>
                                <td className="px-4 py-3 font-semibold text-slate-900">Rs. {lineTotal.toFixed(2)}</td>
                                <td className="px-4 py-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => removeItemRow(index)}
                                    className="rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Invoice total</p>
                  <p className="text-3xl font-semibold text-slate-900">Rs. {invoiceTotal.toFixed(2)}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    Save invoice
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="min-w-225 md:min-w-full w-full text-sm">
          <thead className="bg-linear-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Invoice No.</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Customer</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Items</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Total</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Date</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Status</th>
              <th className="px-5 py-4 text-left text-gray-600 font-semibold border-b-2 border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-400 italic py-10">
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
                  <td className="px-5 py-4 border-b border-gray-100 text-gray-700">
                    <div className="space-y-1">
                      {(bill.items || []).map((it) => (
                        <div key={it.id || `${it.service_id}-${it.quantity}-${it.unit_price}`} className="flex flex-wrap gap-x-2">
                          <span className="font-semibold">{it.service_name}</span>
                          <span className="text-gray-500">x{it.quantity}</span>
                          <span className="text-gray-500">@ Rs. {Number(it.unit_price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-100 font-bold text-gray-900">Rs. {Number(bill.total).toFixed(2)}</td>
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
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 hover:shadow-md transition-all duration-300"
                        onClick={() => {
                          const customer = customers.find(c => c.id === bill.customer_id);
                          setSelectedBillForPDF({
                            ...bill,
                            customer_email: customer?.email || "",
                            customer_phone: customer?.phone || "",
                            customer_address: customer?.address || "",
                          });
                          setIsPDFModalOpen(true);
                        }}
                      >
                        View PDF
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-800 hover:shadow-md transition-all duration-300"
                        onClick={() => handleDelete(bill.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* PDF Preview Modal */}
      <BillPDFModal
        bill={selectedBillForPDF}
        isOpen={isPDFModalOpen}
        onClose={() => {
          setIsPDFModalOpen(false);
          setSelectedBillForPDF(null);
        }}
      />
    </div>
  );
};

export default Bills;
