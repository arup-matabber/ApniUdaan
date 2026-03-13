import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api';
import { setUser, clearUser } from '@/redux/authSlice';
import { toast } from 'sonner';

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Check if user is authenticated on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token && !user) {
                try {
                    setLoading(true);
                    const response = await authAPI.getProfile();
                    dispatch(setUser(response.data.user));
                } catch (error) {
                    localStorage.removeItem('token');
                    dispatch(clearUser());
                } finally {
                    setLoading(false);
                }
            }
        };

        checkAuth();
    }, [dispatch, user]);

    const login = useCallback(async (credentials) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await authAPI.login(credentials);
            const { user: userData, token } = response.data;
            
            localStorage.setItem('token', token);
            dispatch(setUser(userData));
            
            toast.success('Login successful!');
            
            // Redirect based on role
            if (userData.role === 'recruiter') {
                navigate('/admin/companies');
            } else {
                navigate('/');
            }
            
            return { success: true };
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            return { success: false, error: error.response?.data?.message };
        } finally {
            setLoading(false);
        }
    }, [dispatch, navigate]);

    const register = useCallback(async (userData) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await authAPI.register(userData);
            const { user: newUser, token } = response.data;
            
            localStorage.setItem('token', token);
            dispatch(setUser(newUser));
            
            toast.success('Registration successful!');
            
            // Redirect based on role
            if (newUser.role === 'recruiter') {
                navigate('/admin/companies');
            } else {
                navigate('/');
            }
            
            return { success: true };
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
            return { success: false, error: error.response?.data?.message };
        } finally {
            setLoading(false);
        }
    }, [dispatch, navigate]);

    const logout = useCallback(async () => {
        try {
            setLoading(true);
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            dispatch(clearUser());
            navigate('/login');
            toast.success('Logged out successfully');
            setLoading(false);
        }
    }, [dispatch, navigate]);

    const updateProfile = useCallback(async (profileData) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await authAPI.updateProfile(profileData);
            dispatch(setUser(response.data.user));
            
            toast.success('Profile updated successfully!');
            return { success: true };
        } catch (error) {
            setError(error.response?.data?.message || 'Profile update failed');
            return { success: false, error: error.response?.data?.message };
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    const changePassword = useCallback(async (passwordData) => {
        try {
            setLoading(true);
            setError(null);
            
            await authAPI.changePassword(passwordData);
            toast.success('Password changed successfully!');
            return { success: true };
        } catch (error) {
            setError(error.response?.data?.message || 'Password change failed');
            return { success: false, error: error.response?.data?.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const forgotPassword = useCallback(async (email) => {
        try {
            setLoading(true);
            setError(null);
            
            await authAPI.forgotPassword(email);
            toast.success('Password reset email sent!');
            return { success: true };
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send reset email');
            return { success: false, error: error.response?.data?.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const resetPassword = useCallback(async (token, password) => {
        try {
            setLoading(true);
            setError(null);
            
            await authAPI.resetPassword(token, password);
            toast.success('Password reset successfully!');
            navigate('/login');
            return { success: true };
        } catch (error) {
            setError(error.response?.data?.message || 'Password reset failed');
            return { success: false, error: error.response?.data?.message };
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const verifyEmail = useCallback(async (token) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await authAPI.verifyEmail(token);
            dispatch(setUser(response.data.user));
            toast.success('Email verified successfully!');
            return { success: true };
        } catch (error) {
            setError(error.response?.data?.message || 'Email verification failed');
            return { success: false, error: error.response?.data?.message };
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        verifyEmail,
        clearError,
    };
};
