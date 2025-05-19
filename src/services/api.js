import axios from 'axios';

const baseURL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token ao header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Serviços de autenticação
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getUser: () => api.get('/auth/me')
};

// Serviços de contratações
export const contratacaoService = {
  getAll: () => api.get('/contratacoes'),
  getById: (id) => api.get(`/contratacoes/${id}`),
  create: (data) => api.post('/contratacoes', data),
  update: (id, data) => api.put(`/contratacoes/${id}`, data),
  remove: (id) => api.delete(`/contratacoes/${id}`)
};

// Serviço de upload
export const uploadService = {
  uploadPca: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/upload/pca', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default api;