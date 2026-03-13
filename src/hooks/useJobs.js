import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { jobsAPI } from '@/services/api';
import { setJobs, addJob, updateJob, deleteJob, setLoading, setError } from '@/redux/jobSlice';
import { toast } from 'sonner';

export const useJobs = (options = {}) => {
    const dispatch = useDispatch();
    const { jobs, loading, error } = useSelector(state => state.job);
    const [filters, setFilters] = useState(options.filters || {});
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    // Memoized query parameters
    const queryParams = useMemo(() => ({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        sortBy,
        sortOrder,
        ...filters
    }), [pagination.page, pagination.limit, searchQuery, sortBy, sortOrder, filters]);

    // Fetch jobs with caching
    const fetchJobs = useCallback(async (params = queryParams) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            
            const response = await jobsAPI.getAll(params);
            const { jobs: jobsData, pagination: paginationData } = response.data;
            
            dispatch(setJobs(jobsData));
            setPagination(prev => ({
                ...prev,
                total: paginationData.total,
                totalPages: paginationData.totalPages
            }));
            
            return jobsData;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Failed to fetch jobs'));
            return [];
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, queryParams]);

    // Search jobs
    const searchJobs = useCallback(async (query) => {
        setSearchQuery(query);
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    // Apply filters
    const applyFilters = useCallback((newFilters) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    // Clear filters
    const clearFilters = useCallback(() => {
        setFilters({});
        setSearchQuery('');
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    // Change page
    const changePage = useCallback((page) => {
        setPagination(prev => ({ ...prev, page }));
    }, []);

    // Change limit
    const changeLimit = useCallback((limit) => {
        setPagination(prev => ({ ...prev, limit, page: 1 }));
    }, []);

    // Sort jobs
    const sortJobs = useCallback((field, order = 'asc') => {
        setSortBy(field);
        setSortOrder(order);
    }, []);

    // Get job by ID
    const getJobById = useCallback(async (id) => {
        try {
            const response = await jobsAPI.getById(id);
            return response.data.job;
        } catch {
            toast.error('Failed to fetch job details');
            return null;
        }
    }, []);

    // Create job
    const createJob = useCallback(async (jobData) => {
        try {
            dispatch(setLoading(true));
            const response = await jobsAPI.create(jobData);
            const newJob = response.data.job;
            
            dispatch(addJob(newJob));
            toast.success('Job created successfully!');
            
            return { success: true, job: newJob };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create job';
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // Update job
    const updateJobById = useCallback(async (id, jobData) => {
        try {
            dispatch(setLoading(true));
            const response = await jobsAPI.update(id, jobData);
            const updatedJob = response.data.job;
            
            dispatch(updateJob(updatedJob));
            toast.success('Job updated successfully!');
            
            return { success: true, job: updatedJob };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update job';
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // Delete job
    const deleteJobById = useCallback(async (id) => {
        try {
            dispatch(setLoading(true));
            await jobsAPI.delete(id);
            
            dispatch(deleteJob(id));
            toast.success('Job deleted successfully!');
            
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete job';
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // Apply for job
    const applyForJob = useCallback(async (jobId, applicationData) => {
        try {
            const response = await jobsAPI.apply(jobId, applicationData);
            toast.success('Application submitted successfully!');
            return { success: true, application: response.data.application };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to submit application';
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    }, []);

    // Get recommended jobs
    const getRecommendedJobs = useCallback(async () => {
        try {
            const response = await jobsAPI.getRecommended();
            return response.data.jobs;
        } catch (error) {
            console.error('Failed to fetch recommended jobs:', error);
            return [];
        }
    }, []);

    // Get featured jobs
    const getFeaturedJobs = useCallback(async () => {
        try {
            const response = await jobsAPI.getFeatured();
            return response.data.jobs;
        } catch (error) {
            console.error('Failed to fetch featured jobs:', error);
            return [];
        }
    }, []);

    // Get jobs by company
    const getJobsByCompany = useCallback(async (companyId) => {
        try {
            const response = await jobsAPI.getByCompany(companyId);
            return response.data.jobs;
        } catch (error) {
            console.error('Failed to fetch company jobs:', error);
            return [];
        }
    }, []);

    // Memoized filtered and sorted jobs
    const filteredJobs = useMemo(() => {
        let filtered = [...jobs];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(query) ||
                job.description.toLowerCase().includes(query) ||
                job.company?.name?.toLowerCase().includes(query) ||
                job.location?.address?.city?.toLowerCase().includes(query)
            );
        }

        // Apply additional filters
        if (filters.locationType) {
            filtered = filtered.filter(job => job.location.type === filters.locationType);
        }
        if (filters.jobType) {
            filtered = filtered.filter(job => job.jobType === filters.jobType);
        }
        if (filters.experienceLevel) {
            filtered = filtered.filter(job => job.experienceLevel === filters.experienceLevel);
        }
        if (filters.salaryMin) {
            filtered = filtered.filter(job => job.salary.max >= filters.salaryMin);
        }
        if (filters.salaryMax) {
            filtered = filtered.filter(job => job.salary.min <= filters.salaryMax);
        }

        // Sort jobs
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'salary') {
                aValue = a.salary.min;
                bValue = b.salary.min;
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [jobs, searchQuery, filters, sortBy, sortOrder]);

    // Initial fetch
    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    return {
        // State
        jobs: filteredJobs,
        loading,
        error,
        filters,
        pagination,
        searchQuery,
        sortBy,
        sortOrder,

        // Actions
        fetchJobs,
        searchJobs,
        applyFilters,
        clearFilters,
        changePage,
        changeLimit,
        sortJobs,
        getJobById,
        createJob,
        updateJobById,
        deleteJobById,
        applyForJob,
        getRecommendedJobs,
        getFeaturedJobs,
        getJobsByCompany,

        // Utilities
        hasNextPage: pagination.page < pagination.totalPages,
        hasPrevPage: pagination.page > 1,
        totalJobs: pagination.total,
    };
};
