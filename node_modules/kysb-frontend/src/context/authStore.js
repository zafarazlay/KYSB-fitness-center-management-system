import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../services/supabase.js';

/**
 * Auth Store with Supabase Integration
 * Manages authentication state using Supabase Auth
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
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          // Fetch member profile if user is a member
          let profile = null;
          const { data: memberData } = await supabase
            .from('members')
            .select('*')
            .eq('auth_user_id', data.user.id)
            .single();

          if (memberData) {
            profile = memberData;
          }

          set({
            user: data.user,
            profile,
            userRole: data.user.user_metadata?.role || 'member',
            isAuthenticated: true,
            isLoading: false,
          });

          return { user: data.user, profile };
        } catch (error) {
          set({
            error: error.message || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await supabase.auth.signOut();
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            userRole: null,
          });
        } catch (error) {
          set({
            error: error.message || 'Logout failed',
            isLoading: false,
          });
          throw error;
        }
      },

      // Update User Profile
      updateProfile: async (updates) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('members')
            .update(updates)
            .eq('auth_user_id', get().user.id)
            .select()
            .single();

          if (error) throw error;

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

      // Initialize from Supabase session
      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.getSession();

          if (error) throw error;

          if (data.session) {
            const user = data.session.user;

            // Fetch member profile if user is a member
            let profile = null;
            if (user.user_metadata?.role === 'member') {
              const { data: memberData } = await supabase
                .from('members')
                .select('*')
                .eq('auth_user_id', user.id)
                .single();

              if (memberData) {
                profile = memberData;
              }
            }

            set({
              user,
              profile,
              userRole: user.user_metadata?.role || 'member',
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
          set({
            isLoading: false,
            error: error.message,
          });
        }
      },

      // Subscribe to auth changes
      subscribeToAuthChanges: () => {
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (session) {
            set({
              user: session.user,
              userRole: session.user.user_metadata?.role || 'member',
              isAuthenticated: true,
            });
          } else {
            set({
              user: null,
              profile: null,
              isAuthenticated: false,
              userRole: null,
            });
          }
        });
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
