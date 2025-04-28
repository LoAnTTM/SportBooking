import apiClient from './apiClient';
import { ApiResponse, AuthResponse, LoginRequest } from './types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/logout', {});
  },

  refreshToken: async (): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<AuthResponse>('/auth/refresh', {});
  },

  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/forgot-password', { email });
  },

  resetPassword: async (email: string, token: number, password: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/reset-password', { email, token, password });
  },

  verifyRegisterToken: async (email: string, token: number): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<AuthResponse>('/auth/verify-register-token', { email, token });
  },

  resendVerifyRegisterToken: async (token: number): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/verify-register-token/resend', { token });
  },
};
