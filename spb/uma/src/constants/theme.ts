export interface IColorScheme {
  backgroundLight: string;
  backgroundDark: string;
  backgroundContent: string;
  primary: string;
  secondary: string;
  disable: string;
  shadow: string;
  icon: string;
  textLight: string;
  textDark: string;
  success: string;
  error: string;
  warning: string;
  borderLight: string;
  borderDark: string;
}
export interface IColor {
  light: IColorScheme;
  dark: IColorScheme;
}

export const Color: IColor = {
  light: {
    backgroundLight: '#FFFFFF',
    backgroundDark: '#F2F2F2',
    backgroundContent: '#F7F7F9',
    primary: '#E86F00',
    secondary: '#F7F7F9',
    disable: '#f1a866',
    shadow: '#6A6A6A',
    icon: '#6A6A6A',
    textLight: '#707B81',
    textDark: '#000000',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFFF00',
    borderLight: '#DDDDDD',
    borderDark: '#6A6A6A',
  },
  dark: {
    backgroundLight: '#FFFFFF',
    backgroundDark: '#F2F2F2',
    backgroundContent: '#F7F7F9',
    primary: '#E86F00',
    secondary: '#F7F7F9',
    disable: '#DDDDDD',
    shadow: '#000000',
    icon: '#6A6A6A',
    textLight: '#707B81',
    textDark: '#000000',
    success: '#008000',
    error: '#FF0000',
    warning: '#FFFF00',
    borderLight: '#E0E0E0',
    borderDark: '#DDDDDD',
  },
};

export const Radius = {
  xs: 5,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
};
