import axios from 'axios';
import { toast } from 'sonner';

// Create axios instance with default config
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add loading state if needed
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;
        
        if (response) {
            const { status, data } = response;
            
            switch (status) {
                case 401:
                    // Unauthorized - redirect to login
                    localStorage.removeItem('token');
                    // Don't redirect automatically, let components handle it
                    console.warn('Authentication required');
                    break;
                    
                case 403:
                    toast.error('Access denied. You don\'t have permission to perform this action.');
                    break;
                    
                case 404:
                    console.warn('Resource not found:', error.config?.url);
                    break;
                    
                case 422:
                    // Validation errors
                    if (data.errors) {
                        Object.values(data.errors).forEach(error => {
                            toast.error(error);
                        });
                    } else {
                        toast.error(data.message || 'Validation failed.');
                    }
                    break;
                    
                case 429:
                    toast.error('Too many requests. Please try again later.');
                    break;
                    
                case 500:
                    toast.error('Server error. Please try again later.');
                    break;
                    
                default:
                    console.warn('API Error:', data?.message || 'Something went wrong.');
            }
        } else if (error.code === 'ECONNABORTED') {
            toast.error('Request timeout. Please check your connection.');
        } else if (error.code === 'NETWORK_ERROR') {
            toast.error('Network error. Please check your connection.');
        } else {
            console.warn('Network error:', error.message);
        }
        
        return Promise.reject(error);
    }
);

// API service methods
export const authAPI = {
    login: (credentials) => api.post('/user/login', credentials),
    register: (userData) => api.post('/user/register', userData),
    logout: () => api.get('/user/logout'),
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data),
    changePassword: (data) => api.put('/user/change-password', data),
    forgotPassword: (email) => api.post('/user/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/user/reset-password', { token, password }),
    verifyEmail: (token) => api.post('/user/verify-email', { token }),
};

// User API (alias for authAPI for profile components)
export const userAPI = {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data),
    getAchievements: () => api.get('/user/achievements'),
    getStats: () => api.get('/user/stats'),
    updatePreferences: (data) => api.put('/user/preferences', data),
    uploadAvatar: (formData) => api.post('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export const jobsAPI = {
    getAll: (params = {}) => api.get('/job', { params }),
    getById: (id) => api.get(`/job/${id}`),
    create: (jobData) => api.post('/job', jobData),
    update: (id, jobData) => api.put(`/job/${id}`, jobData),
    delete: (id) => api.delete(`/job/${id}`),
    apply: (id, applicationData) => api.post(`/job/${id}/apply`, applicationData),
    getApplications: (id) => api.get(`/job/${id}/applications`),
    search: (query) => api.get('/job/search', { params: query }),
    getRecommended: () => api.get('/job/recommended'),
    getFeatured: () => api.get('/job/featured'),
    getByCompany: (companyId) => api.get(`/job/company/${companyId}`),
};

export const companiesAPI = {
    getAll: (params = {}) => api.get('/company', { params }),
    getById: (id) => api.get(`/company/${id}`),
    create: (companyData) => api.post('/company', companyData),
    update: (id, companyData) => api.put(`/company/${id}`, companyData),
    delete: (id) => api.delete(`/company/${id}`),
    getJobs: (id) => api.get(`/company/${id}/jobs`),
    uploadLogo: (id, formData) => api.put(`/company/${id}/logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export const applicationsAPI = {
    getAll: (params = {}) => api.get('/application', { params }),
    getById: (id) => api.get(`/application/${id}`),
    update: (id, data) => api.put(`/application/${id}`, data),
    delete: (id) => api.delete(`/application/${id}`),
    getMyApplications: () => api.get('/application/my-applications'),
    getCompanyApplications: (companyId) => api.get(`/application/company/${companyId}`),
    updateStatus: (id, status) => api.patch(`/application/${id}/status`, { status }),
};

export const resumeAPI = {
    upload: (formData) => api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    generate: (data) => api.post('/resume/generate', data),
    download: (id) => api.get(`/resume/${id}/download`),
    delete: (id) => api.delete(`/resume/${id}`),
};

export const analyticsAPI = {
    getDashboardStats: () => api.get('/analytics/dashboard'),
    getJobStats: (jobId) => api.get(`/analytics/job/${jobId}`),
    getCompanyStats: (companyId) => api.get(`/analytics/company/${companyId}`),
    getUserStats: () => api.get('/analytics/user'),
};

export const aiAPI = {
    analyzeResume: (data) => api.post('/ai/analyze-resume', data),
    getJobRecommendations: (data) => api.post('/ai/job-recommendations', data),
    generateResume: (data) => api.post('/ai/generate-resume', data),
    getInterviewQuestions: (data) => api.post('/ai/interview-questions', data),
    generateJobDescription: (data) => api.post('/ai/generate-job-description', data),
    analyzeSkillsGap: (data) => api.post('/ai/skills-gap-analysis', data),
    generateCoverLetter: (data) => api.post('/ai/generate-cover-letter', data),
    getSalaryNegotiationTips: (data) => api.post('/ai/salary-negotiation', data),
    analyzeCareerPath: (data) => api.post('/ai/career-path-analysis', data),
};

// Career & Education Advisor API Services
export const quizAPI = {
    getAll: (params = {}) => api.get('/quiz', { params }),
    getById: (id) => api.get(`/quiz/${id}`),
    submitAttempt: (quizId, data) => api.post(`/quiz/${quizId}/attempt`, data),
    getMyAttempts: () => api.get('/quiz/my-attempts'),
    getUserAttempts: () => api.get('/quiz/my-attempts'), // Alias for profile page
    getAttemptById: (id) => api.get(`/quiz/attempt/${id}`),
    getResults: (attemptId) => api.get(`/quiz/attempt/${attemptId}/results`),
    // Quick anonymous quiz endpoints
    getQuestions: (quizId) => api.get('/quiz/questions', { params: { quizId } }),
    submitQuick: (data) => api.post('/quiz/submit', data),
    // AI Assistant endpoints
    askQuestion: (question) => api.post('/quiz/assistant', { question }),
    getQuestionStream: (question) => {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
        return `${baseURL}/quiz/assistant?question=${encodeURIComponent(question)}`;
    }
};

export const recommendationsAPI = {
    getPersonalized: (params = {}) => api.get('/recommendations', { params }),
    getStreams: (params = {}) => api.get('/recommendations/streams', { params }),
    getDegrees: (params = {}) => api.get('/recommendations/degrees', { params }),
    getCareers: (params = {}) => api.get('/recommendations/careers', { params }),
    getContent: (params = {}) => api.get('/recommendations/content', { params }),
    updatePreferences: (data) => api.put('/recommendations/preferences', data),
};

export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`)
};

export const collegesAPI = {
    getAll: (params = {}) => api.get('/colleges', { params }),
    getById: (id) => api.get(`/colleges/${id}`),
    getPrograms: (id, params = {}) => api.get(`/colleges/${id}/programs`, { params }),
    search: (query) => api.get('/colleges/search', { params: query }),
    getNearby: (lat, lng, radius = 50) => api.get('/colleges/nearby', { 
        params: { lat, lng, radius } 
    }),
    getByState: (state) => api.get(`/colleges/state/${state}`),
    getFilters: () => api.get('/colleges/filters'),
};

export const programsAPI = {
    getAll: (params = {}) => api.get('/programs', { params }),
    getById: (id) => api.get(`/programs/${id}`),
    getByCollege: (collegeId, params = {}) => api.get(`/programs/college/${collegeId}`, { params }),
    getByDegree: (degreeId, params = {}) => api.get(`/programs/degree/${degreeId}`, { params }),
    search: (query) => api.get('/programs/search', { params: query }),
};

export const timelineAPI = {
    getEvents: (params = {}) => api.get('/timeline', { params }),
    getById: (id) => api.get(`/timeline/${id}`),
    subscribe: (eventId) => api.post(`/timeline/${eventId}/subscribe`),
    unsubscribe: (eventId) => api.delete(`/timeline/${eventId}/subscribe`),
    getMySubscriptions: () => api.get('/timeline/my-subscriptions'),
    exportICS: (eventId) => api.get(`/timeline/${eventId}/export`, { 
        responseType: 'blob' 
    }),
    getUpcoming: () => api.get('/timeline/upcoming'),
    getByType: (type) => api.get(`/timeline/type/${type}`),
};

export const contentAPI = {
    getAll: (params = {}) => api.get('/content', { params }),
    getById: (id) => api.get(`/content/${id}`),
    getByType: (type, params = {}) => api.get(`/content/type/${type}`, { params }),
    getByStream: (streamId, params = {}) => api.get(`/content/stream/${streamId}`, { params }),
    getByDegree: (degreeId, params = {}) => api.get(`/content/degree/${degreeId}`, { params }),
    search: (query) => api.get('/content/search', { params: query }),
    download: (id) => api.get(`/content/${id}/download`, { responseType: 'blob' }),
    getFeatured: () => api.get('/content/featured'),
    getScholarships: (params = {}) => api.get('/content/scholarships', { params }),
};

export const bookmarksAPI = {
    getAll: (params = {}) => api.get('/bookmarks', { params }),
    add: (data) => api.post('/bookmarks', data),
    remove: (id) => api.delete(`/bookmarks/${id}`),
    getByType: (entityType) => api.get(`/bookmarks/type/${entityType}`),
    toggle: (entityType, entityId) => api.post('/bookmarks/toggle', { entityType, entityId }),
};

export const careerGraphAPI = {
    getGraph: (params = {}) => api.get('/career-graph', { params }),
    getPathways: (fromType, fromId, toType) => api.get('/career-graph/pathways', {
        params: { fromType, fromId, toType }
    }),
    getSkills: (params = {}) => api.get('/career-graph/skills', { params }),
    getCareers: (params = {}) => api.get('/career-graph/careers', { params }),
    getConnections: (nodeType, nodeId) => api.get(`/career-graph/connections/${nodeType}/${nodeId}`),
};

export const streamsAPI = {
    getAll: (params = {}) => api.get('/streams', { params }),
    getById: (id) => api.get(`/streams/${id}`),
    getDegrees: (id) => api.get(`/streams/${id}/degrees`),
};

export const degreesAPI = {
    getAll: (params = {}) => api.get('/degrees', { params }),
    getById: (id) => api.get(`/degrees/${id}`),
    getByStream: (streamId) => api.get(`/degrees/stream/${streamId}`),
    getPrograms: (id) => api.get(`/degrees/${id}/programs`),
};

// Admin API Services
export const adminAPI = {
    // Dashboard
    getDashboardStats: () => api.get('/admin/dashboard'),
    
    // Users Management
    users: {
        getAll: (params = {}) => api.get('/admin/users', { params }),
        getById: (id) => api.get(`/admin/users/${id}`),
        update: (id, data) => api.put(`/admin/users/${id}`, data),
        delete: (id) => api.delete(`/admin/users/${id}`),
        bulkUpdate: (data) => api.put('/admin/users/bulk', data),
        export: () => api.get('/admin/users/export', { responseType: 'blob' }),
    },
    
    // Colleges Management
    colleges: {
        getAll: (params = {}) => api.get('/admin/colleges', { params }),
        create: (data) => api.post('/admin/colleges', data),
        update: (id, data) => api.put(`/admin/colleges/${id}`, data),
        delete: (id) => api.delete(`/admin/colleges/${id}`),
        bulkImport: (formData) => api.post('/admin/colleges/bulk-import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
    },
    
    // Programs Management
    programs: {
        getAll: (params = {}) => api.get('/admin/programs', { params }),
        create: (data) => api.post('/admin/programs', data),
        update: (id, data) => api.put(`/admin/programs/${id}`, data),
        delete: (id) => api.delete(`/admin/programs/${id}`),
        bulkImport: (formData) => api.post('/admin/programs/bulk-import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
    },
    
    // Timeline Events Management
    timeline: {
        getAll: (params = {}) => api.get('/admin/timeline', { params }),
        create: (data) => api.post('/admin/timeline', data),
        update: (id, data) => api.put(`/admin/timeline/${id}`, data),
        delete: (id) => api.delete(`/admin/timeline/${id}`),
        bulkImport: (formData) => api.post('/admin/timeline/bulk-import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
    },
    
    // Content Management
    content: {
        getAll: (params = {}) => api.get('/admin/content', { params }),
        create: (data) => api.post('/admin/content', data),
        update: (id, data) => api.put(`/admin/content/${id}`, data),
        delete: (id) => api.delete(`/admin/content/${id}`),
        bulkImport: (formData) => api.post('/admin/content/bulk-import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
    },
    
    // Career Graph Management
    careerGraph: {
        getSkills: (params = {}) => api.get('/admin/career-graph/skills', { params }),
        createSkill: (data) => api.post('/admin/career-graph/skills', data),
        updateSkill: (id, data) => api.put(`/admin/career-graph/skills/${id}`, data),
        deleteSkill: (id) => api.delete(`/admin/career-graph/skills/${id}`),
        
        getCareers: (params = {}) => api.get('/admin/career-graph/careers', { params }),
        createCareer: (data) => api.post('/admin/career-graph/careers', data),
        updateCareer: (id, data) => api.put(`/admin/career-graph/careers/${id}`, data),
        deleteCareer: (id) => api.delete(`/admin/career-graph/careers/${id}`),
        
        getPathways: (params = {}) => api.get('/admin/career-graph/pathways', { params }),
        createPathway: (data) => api.post('/admin/career-graph/pathways', data),
        updatePathway: (id, data) => api.put(`/admin/career-graph/pathways/${id}`, data),
        deletePathway: (id) => api.delete(`/admin/career-graph/pathways/${id}`),
    },
    
    // Analytics
    analytics: {
        getUserStats: () => api.get('/admin/analytics/users'),
        getQuizStats: () => api.get('/admin/analytics/quizzes'),
        getRecommendationStats: () => api.get('/admin/analytics/recommendations'),
        getContentStats: () => api.get('/admin/analytics/content'),
        getSystemHealth: () => api.get('/admin/analytics/system-health'),
    },
};

// Utility functions
export const uploadFile = async (file, onProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: onProgress ? (progressEvent) => {
            const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
        } : undefined,
    });
};

export default api;
