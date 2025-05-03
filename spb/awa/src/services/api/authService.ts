import apiClient from './apiClient';
import { ApiResponse, AuthResponse, LoginRequest, RefreshResponse } from './types';

// Get the API URL from environment variables
const API_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export const authService = {
	login: async (
		credentials: LoginRequest
	): Promise<ApiResponse<AuthResponse>> => {
		try {
			// Make a direct axios call to ensure cookies are properly handled
			const response = await apiClient.post<AuthResponse>(
				`${API_URL}/auth/login`,
				credentials
			);

			// Return the response in the expected format
			return {
				success: true,
				data: response.data,
				code: response.code,
			};
		} catch (error: any) {
			console.error("Login error:", error);
			return {
				success: false,
				error:
					error.response?.data?.message ||
					error.message ||
					"An error occurred",
			};
		}
	},

	logout: async (): Promise<ApiResponse<void>> => {
		try {
			// Make a direct axios call to ensure cookies are properly handled
			await apiClient.post(`${API_URL}/auth/logout`);

			// Clear localStorage only - cookies will be cleared by the server
			localStorage.removeItem("token");
			localStorage.removeItem("user");

			return {
				success: true,
			};
		} catch (error: any) {
			console.error("Logout error:", error);
			return {
				success: false,
				error:
					error.response?.data?.message ||
					error.message ||
					"An error occurred",
			};
		}
	},

	refreshToken: async (): Promise<ApiResponse<RefreshResponse>> => {
		try {
			// Make a direct axios call to ensure cookies are properly handled
			const response = await apiClient.post<RefreshResponse>(`${API_URL}/auth/refresh`);

			// Return the response in the expected format
			return {
				success: true,
				data: response.data,
			};
		} catch (error: any) {
			console.error("Refresh token error:", error);
			return {
				success: false,
				error:
					error.response?.data?.message ||
					error.message ||
					"An error occurred",
			};
		}
	},

	forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
		return apiClient.post<void>("/auth/forgot-password", { email });
	},

	resetPassword: async (
		email: string,
		token: number,
		password: string
	): Promise<ApiResponse<void>> => {
		return apiClient.post<void>("/auth/reset-password", {
			email,
			token,
			password,
		});
	},

	verifyRegisterToken: async (
		email: string,
		token: number
	): Promise<ApiResponse<AuthResponse>> => {
		return apiClient.post<AuthResponse>("/auth/verify-register-token", {
			email,
			token,
		});
	},

	resendVerifyRegisterToken: async (
		token: number
	): Promise<ApiResponse<void>> => {
		return apiClient.post<void>("/auth/verify-register-token/resend", {
			token,
		});
	},
};
