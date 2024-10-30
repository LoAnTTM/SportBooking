import { httpService } from './httpService'; // Assuming httpService is set up as described earlier
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Define login request function
export const login = async (email: string, password: string) => {
  try {
    const response = await httpService.post('/auth/login', { email, password });

    // If the login is successful, store the token
    if (response.data?.data.access_token) {
      await AsyncStorage.setItem('authToken', response.data.data.access_token);
      return response.data;
    } else {
      throw new Error('Login failed: No tokens returned');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log('Login Error:', error.message);
    } else {
      console.log('An unknown error occurred during login.');
    }
    return null;
  }
};

// Define register request function
export const register = async (email: string, password: string) => {
  try {
    const response = await httpService.post('/auth/register', { email, password});

    // Handle the successful registration response
    if (response.data.data.message) {
      return response.data.data.message;  
    } else {
      throw new Error('Registration failed');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log('Registration Error:', error.message);
    } else {
      console.log('An unknown error occurred during registration.');
    }
    return null;
  }
};

// Define logout function to remove token from AsyncStorage
export const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    Alert.alert('Logged out successfully');
    return true;
  };
