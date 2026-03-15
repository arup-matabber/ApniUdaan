import api from './api';

export const bookmarksAPI = {
  getAll: () => api.get('/bookmarks'),
};
