export const DISABLE_COLOR = '#E0E0E0';

export const CARD_COLORS = [
  '#4CAF50',
  '#2196F3',
  '#F44336',
  '#FF9800',
  '#5C6BC0',
  '#7E57C2',
  '#03A9F4',
];

export const RANDOM_CARD_COLOR = () => {
  return CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)];
};

export interface IColorScheme {
  backgroundLight: string;
  backgroundDark: string;
  backgroundContent: string;
  backgroundVariant: string;
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
  white: string;
  blue: string;
  red: string;
  overlay: string;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
}
export interface IColor {
  light: IColorScheme;
  dark: IColorScheme;
}

export const Color: IColor = {
  light: {
    backgroundLight: '#FFFFFF',
    backgroundDark: '#f2f2f2',
    backgroundContent: '#F7F7F9',
	backgroundVariant: '#F0F2F5',
    primary: '#FE7743',
    secondary: '#F7F7F9',
    disable: '#DDDDDD',
    shadow: '#6A6A6A',
    icon: '#6A6A6A',
    textLight: '#707B81',
    textDark: '#000000',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFFF00',
    borderLight: '#DDDDDD',
    borderDark: '#6A6A6A',
    white: '#FFFFFF',
    blue: '#007AFF',
    red: '#F44336',
    overlay: 'rgba(0, 0, 0, 0.5)',
    color1: 'rgba(0,122,255,0.3)',
    color2: '#b2d7ff',
    color3: '#5C6BC0',
    color4: '#03A9F4',
  },
  dark: {
    backgroundLight: '#FFFFFF',
    backgroundDark: '#f2f2f2',
    backgroundContent: '#F7F7F9',
	backgroundVariant: '#F0F2F5',
    primary: '#FE7743',
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
    white: '#FFFFFF',
    blue: '#007AFF',
    red: '#F44336',
    overlay: 'rgba(0, 0, 0, 0.5)',
    color1: 'rgba(0,122,255,0.3)',
    color2: '#b2d7ff',
    color3: '#5C6BC0',
    color4: '#03A9F4',
  },
};

export const Radius = {
  xs: 5,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  full: 9999,
};
