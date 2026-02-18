const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = {
  // Auth endpoints
  register: (data) => fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  login: (data) => fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  getProfile: (token) => fetch(`${API_BASE_URL}/auth/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  // Project endpoints
  createProject: (data, token) => fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  getProjects: (token) => fetch(`${API_BASE_URL}/projects`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  getProject: (id, token) => fetch(`${API_BASE_URL}/projects/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  updateProject: (id, data, token) => fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  deleteProject: (id, token) => fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  getProjectDashboard: (id, token) => fetch(`${API_BASE_URL}/projects/${id}/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  // Task endpoints
  createTask: (data, token) => fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  getTasks: (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/tasks?${queryString}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json());
  },

  getTask: (id, token) => fetch(`${API_BASE_URL}/tasks/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  updateTask: (id, data, token) => fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  deleteTask: (id, token) => fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  addComment: (id, data, token) => fetch(`${API_BASE_URL}/tasks/${id}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  getTaskIntelligence: (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/tasks/intelligence?${queryString}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json());
  }
};

export default api;