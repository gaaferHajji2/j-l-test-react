const BASE_URL = 'http://127.0.0.1:8000/api';

const getHeaders = (includeAuth = false) => {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
};

export const api = {
  post: async (endpoint, body, includeAuth = false) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(includeAuth),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  get: async (endpoint, includeAuth = true) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(includeAuth),
    });
    return handleResponse(response);
  },

  put: async (endpoint, body, includeAuth = true) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(includeAuth),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (endpoint, includeAuth = true) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(includeAuth),
    });
    return handleResponse(response);
  },
};

// Auth-specific methods
export const authApi = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password }, false);
  },

  logout: async () => {
    return api.post('/auth/logout', {}, true);
  },
};