const API_BASE_URL = 'http://localhost:5000/api';

// Service API Service
export const serviceService = {
  // Get all services
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/services`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Get single service
  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/services/${id}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Create service
  async create(serviceData) {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Update service
  async update(id, serviceData) {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Delete service
  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data;
  },
};

export default serviceService;
