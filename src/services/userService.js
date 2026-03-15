import api from './api';

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  uploadAvatar: (formData) => api.post('/user/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};
