const API_BASE_URL = 'http://localhost:5000/api';

// Customer API Service
export const customerService = {
  // Get all customers
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/customers`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Get single customer
  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Create customer
  async create(customerData) {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Update customer
  async update(id, customerData) {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Delete customer
  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data;
  },
};

export default customerService;
