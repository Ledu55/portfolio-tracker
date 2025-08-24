import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
// Temporary local types
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

export const useLogin = () => {
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const register = useAuthStore((state) => state.register);

  return useMutation({
    mutationFn: (data: UserCreate) => register(data),
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return () => {
    logout();
    // Clear all cached data
    queryClient.clear();
  };
};