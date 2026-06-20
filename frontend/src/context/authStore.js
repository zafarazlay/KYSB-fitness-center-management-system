import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authService from '../services/authService.js';

/**
 * Auth Store
 * Manages authentication state using our backend API
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      userRole: null,

      // Login with email and password
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.authService.login(email, password);
          set({
            user: data.user,
            profile: data.profile || null,
            userRole: data.user?.role || 'member',
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('token', data.token);
          return data;
        } catch (error) {
          set({
            error: error.message || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      // Logout
      logout: () => {
        authService.authService.logout();
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
          userRole: null,
        });
      },

      // Update User Profile
      updateProfile: async (updates) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.authService.updateUser(updates);
          set({
            profile: data,
            isLoading: false,
          });
          return data;
        } catch (error) {
          set({
            error: error.message || 'Profile update failed',
            isLoading: false,
          });
          throw error;
        }
      },

      // Initialize from token
      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const data = await authService.authService.getCurrentUser();
            set({
              user: data.user,
              profile: data.profile || null,
              userRole: data.user?.role || 'member',
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              profile: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('token');
          set({
            isLoading: false,
            error: error.message,
          });
        }
      },

      // Subscribe to auth changes
      subscribeToAuthChanges: () => {
        // Can be implemented for real-time auth updates
      },

      // Clear Error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-store',
      storage: localStorage,
    }
  )
);
