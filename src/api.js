const API = '/api';

function getToken() {
  return localStorage.getItem('admin_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(url, options = {}) {
  const res = await fetch(`${API}${url}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error de conexión' }));
    throw new Error(err.error || `Error ${res.status}`);
  }
  return res.json();
}

export const api = {
  login(username, password) {
    return request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  logout() {
    return request('/admin/logout', { method: 'POST' });
  },

  getProperties(filters = {}) {
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.operation) params.set('operation', filters.operation);
    if (filters.search) params.set('search', filters.search);
    if (filters.featured) params.set('featured', '1');
    const qs = params.toString();
    return request(`/properties${qs ? `?${qs}` : ''}`);
  },

  getProperty(id) {
    return request(`/properties/${id}`);
  },

  createProperty(data) {
    return request('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProperty(id, data) {
    return request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteProperty(id) {
    return request(`/properties/${id}`, { method: 'DELETE' });
  },

  async uploadImages(files) {
    const formData = new FormData();
    files.forEach(f => formData.append('images', f));
    const res = await fetch(`${API}/upload`, {
      method: 'POST',
      headers: authHeaders(),
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Error al subir imágenes' }));
      throw new Error(err.error);
    }
    return res.json();
  },

  deleteImage(filename) {
    return request(`/upload/${filename}`, { method: 'DELETE' });
  },
};
