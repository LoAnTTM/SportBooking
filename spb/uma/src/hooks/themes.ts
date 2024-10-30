import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF9800', // Orange for primary
    accent: '#F57C00',  // Darker orange for accents
    background: '#F5F5F5', // Light background
    surface: '#FFFFFF',
    text: '#000000',
    placeholder: '#757575',
    onSurface: '#000000',
    error: '#B00020',
    notification: '#4CAF50',            
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FFA726', // Lighter orange for dark mode
    accent: '#FFB74D',  // Softer orange for accents
    background: '#121212', // Dark background
    surface: '#1E1E1E',
    text: '#FFFFFF',
    placeholder: '#BDBDBD',
    onSurface: '#FFFFFF',
    error: '#CF6679',
    notification: '#66BB6A',            
  },
};

//
export const useThemeToggle = () => {
  const systemScheme = useColorScheme();
  const [isDarkTheme, setIsDarkTheme] = useState(systemScheme === 'dark');

  useEffect(() => {
    console.log('Theme updated:', isDarkTheme ? 'Dark' : 'Light');
  }, [isDarkTheme]); // Log trạng thái theme để kiểm tra sự thay đổi

  const toggleTheme = () => setIsDarkTheme((prevState) => !prevState);

  return {
    theme: isDarkTheme ? darkTheme : lightTheme,
    toggleTheme,
    isDarkTheme,
  };
};
