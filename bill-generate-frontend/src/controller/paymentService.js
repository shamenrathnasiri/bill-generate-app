const API_BASE_URL = 'http://localhost:5000/api';

// Payment API Service
export const paymentService = {
  // Get all payments
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/payments`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Get single payment
  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Create payment
  async create(paymentData) {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Update payment
  async update(id, paymentData) {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Delete payment
  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data;
  },
};

export default paymentService;
