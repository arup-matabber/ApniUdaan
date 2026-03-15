import api from './api';

export const contentAPI = {
  getAll: (params) => api.get('/content', { params }),
  getById: (id) => api.get(`/content/${id}`),
  getFeatured: () => api.get('/content/featured'),
};
