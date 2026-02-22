const API_BASE_URL = 'http://localhost:5000/api';

// Helper: retry a fetch call with delay (handles backend startup delay in Electron)
async function fetchWithRetry(url, options = {}, retries = 5, delay = 1500) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (err) {
      if (i < retries - 1) {
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
}

// Dashboard API Service
export const dashboardService = {
  // Get all dashboard stats
  async getStats() {
    const response = await fetchWithRetry(`${API_BASE_URL}/dashboard`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
};

export default dashboardService;
