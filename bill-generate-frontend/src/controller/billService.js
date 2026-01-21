const API_BASE_URL = 'http://localhost:5000/api';

// Bill API Service
export const billService = {
  // Get all bills
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/bills`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Get single bill
  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/bills/${id}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Create bill
  async create(billData) {
    const response = await fetch(`${API_BASE_URL}/bills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(billData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Update bill
  async update(id, billData) {
    const response = await fetch(`${API_BASE_URL}/bills/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(billData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Toggle paid status
  async togglePaid(id) {
    const response = await fetch(`${API_BASE_URL}/bills/${id}/toggle-paid`, {
      method: 'PATCH',
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Delete bill
  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/bills/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data;
  },
};

export default billService;
