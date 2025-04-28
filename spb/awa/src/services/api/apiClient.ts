import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from './types';

// Get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

class ApiClient {
  private static instance: ApiClient;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If the error is 401 Unauthorized and not a retry
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            const refreshResponse = await this.api.post('/auth/refresh');
            const { access_token } = refreshResponse.data.data;

            // Save the new token
            localStorage.setItem('token', access_token);

            // Update the authorization header
            originalRequest.headers.Authorization = `Bearer ${access_token}`;

            // Retry the original request
            return this.api(originalRequest);
          } catch (refreshError) {
            // If refresh token fails, redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/auth/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Generic GET method
  public async get<T>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {};
      if (params) {
        config.params = params;
      }

      const response: AxiosResponse = await this.api.get(endpoint, config);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Generic POST method
  public async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.api.post(endpoint, data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Generic PUT method
  public async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.api.put(endpoint, data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Generic DELETE method
  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.api.delete(endpoint);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Error handler
  private handleError(error: any): ApiResponse<any> {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        success: false,
        error: error.response.data.message || 'An error occurred',
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        success: false,
        error: 'No response received from server',
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        success: false,
        error: error.message || 'An unknown error occurred',
      };
    }
  }
}

export default ApiClient.getInstance();
