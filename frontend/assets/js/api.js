const API_BASE = 'http://localhost:3000/api';

const api = {
  getToken() { return localStorage.getItem('token'); },
  
  async request(endpoint, options = {}) {
    const token = this.getToken();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      ...options
    };
    
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          window.location.href = '../pages/login.html';
        }
        throw { status: response.status, ...data };
      }
      return data;
    } catch (error) {
      if (error.name === 'TypeError') {
        throw { message: 'Network error or server is down' };
      }
      throw error;
    }
  },

  get(endpoint) { return this.request(endpoint); },
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); },
  put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); },
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
};
