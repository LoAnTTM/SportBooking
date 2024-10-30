import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native'
import { RootStackParamList } from '@/navigation'
import { StackNavigationProp } from '@react-navigation/stack'

// Base URL for the API requests
const BASE_URL = 'http://127.0.0.1:3000/api/v1'

// Create an Axios instance
const api = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Function to get the access token from AsyncStorage
const getAccessToken = async () => {
	return await AsyncStorage.getItem('authToken')
}

// Function to set the access token in AsyncStorage
const setAccessToken = async (token: string) => {
	await AsyncStorage.setItem('authToken', token)
}

// Function to refresh the access token using the refresh token
const refreshAccessToken = async () => {
	try {
		// Call the refresh token API.
		const response = await api.post('/auth/refresh')
		const newAccessToken = response.data.access_token
		await setAccessToken(newAccessToken)
		return newAccessToken
	} catch (error) {
		throw new Error('Unable to refresh token')
	}
}



// Request interceptor to add Authorization token
api.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		const token = await getAccessToken()
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	},
)

// Response interceptor to handle expired tokens and refresh them
api.interceptors.response.use(
	(response: AxiosResponse) => {
		return response
	},
	async (error) => {
		const originalRequest = error.config
		const { response } = error

		if (response && response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			try {
				const newAccessToken = await refreshAccessToken()

				// Retry the original request with the new access token
				originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
				return api(originalRequest)
			} catch (refreshError) {
				Alert.alert('Session Expired', 'Please log in again.')
				await AsyncStorage.removeItem('authToken') // Clear token if refresh fails
				// Redirect to login screen
				// navigation.navigate('Login')
				return Promise.reject(refreshError)
			}
		}

		if (!response) {
			Alert.alert('Network Error', 'Please check your internet connection.')
		}

		return Promise.reject(error)
	},
)

// Function for GET requests
const get = (url: string, config?: InternalAxiosRequestConfig) => {
	return api.get(url, config)
}

// Function for POST requests
const post = (url: string, data: any, config?: InternalAxiosRequestConfig) => {
	return api.post(url, data, config)
}

// Function for PUT requests
const put = (url: string, data: any, config?: InternalAxiosRequestConfig) => {
	return api.put(url, data, config)
}

// Function for DELETE requests
const del = (url: string, config?: InternalAxiosRequestConfig) => {
	return api.delete(url, config)
}

export const httpService = {
	get,
	post,
	put,
	del,
}
