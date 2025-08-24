import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Temporary local types to avoid module resolution issues
type User = {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
};

type LoginRequest = {
  username: string;
  password: string;
};

type UserCreate = {
  email: string;
  username: string;
  full_name?: string;
  password: string;
  is_active?: boolean;
};

type Token = {
  access_token: string;
  token_type: string;
};
import { authAPI } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: UserCreate) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (data: LoginRequest) => {
        try {
          set({ isLoading: true });
          const tokenResponse: Token = await authAPI.login(data);
          
          // Store token
          localStorage.setItem('access_token', tokenResponse.access_token);
          
          set({
            token: tokenResponse.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: UserCreate) => {
        try {
          set({ isLoading: true });
          const user = await authAPI.register(data);
          
          // Auto login after registration
          await get().login({
            username: data.username,
            password: data.password,
          });
          
          set({
            user,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);