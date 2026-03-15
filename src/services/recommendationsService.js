import api from './api';

export const recommendationsAPI = {
  get: () => api.get('/recommendations'),
};
