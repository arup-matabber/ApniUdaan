import api from './api';

export const quizAPI = {
  getHistory: () => api.get('/quiz/my-attempts'),
  getById: (id) => api.get(`/quiz/${id}`),
  submitAttempt: (id, data) => api.post(`/quiz/${id}/attempt`, data),
};
