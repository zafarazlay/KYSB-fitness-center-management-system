import { useEffect } from 'react';
import { useAuthStore } from '../context/authStore.js';

/**
 * useAuth Hook
 * Provides authentication state and methods with Supabase integration
 */
export const useAuth = () => {
  const {
    user,
    profile,
    isAuthenticated,
    isLoading,
    error,
    userRole,
    login,
    logout,
    updateProfile,
    initializeAuth,
    subscribeToAuthChanges,
    clearError,
  } = useAuthStore();

  useEffect(() => {
    initializeAuth();
    subscribeToAuthChanges();
  }, []);

  return {
    user,
    profile,
    isAuthenticated,
    isLoading,
    error,
    userRole,
    login,
    logout,
    updateProfile,
    initializeAuth,
    subscribeToAuthChanges,
    clearError,
  };
};
