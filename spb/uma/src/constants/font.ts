import { TextStyle } from 'react-native';

type FontFamilyKey =
  | 'SYSTEM'
  | 'POPPINS_BLACK'
  | 'POPPINS_BOLD'
  | 'POPPINS_ITALIC'
  | 'POPPINS_LIGHT'
  | 'POPPINS_MEDIUM'
  | 'POPPINS_REGULAR'
  | 'RALEWAY_BLACK'
  | 'RALEWAY_BOLD'
  | 'RALEWAY_ITALIC'
  | 'RALEWAY_LIGHT'
  | 'RALEWAY_MEDIUM'
  | 'RALEWAY_REGULAR';

type FontFamily = {
  fontFamily: string;
  fontStyle: TextStyle['fontStyle'];
  fontWeight: TextStyle['fontWeight'];
};

type FontFamilyStyles = Record<FontFamilyKey, FontFamily>;

type FontWeightStyles = Record<
  'light' | 'normal' | 'medium' | 'bold' | 'black',
  NonNullable<TextStyle['fontWeight']>
>;

export const fontSize: Record<
  'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl',
  number
> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 32,
};

const fontWeight: FontWeightStyles = {
  light: '300',
  normal: '400',
  medium: '500',
  bold: '700',
  black: '900',
};

export const fontFamily: FontFamilyStyles = {
  SYSTEM: {
    fontFamily: 'System',
    fontStyle: 'normal',
    fontWeight: fontWeight.normal,
  },
  POPPINS_BLACK: {
    fontFamily: 'Poppins-Black, Segoe UI Emoji, Noto Color Emoji',
    fontStyle: 'normal',
    fontWeight: fontWeight.black,
  },
  POPPINS_BOLD: {
    fontFamily: 'Poppins-Bold, Segoe UI Emoji, Noto Color Emoji',
    fontStyle: 'normal',
    fontWeight: fontWeight.bold,
  },
  POPPINS_ITALIC: {
    fontFamily: 'Poppins-Italic, Segoe UI Emoji, Noto Color Emoji',
    fontStyle: 'italic',
    fontWeight: fontWeight.normal,
  },
  POPPINS_LIGHT: {
    fontFamily: 'Poppins-Light, Segoe UI Emoji, Noto Color Emoji',
    fontStyle: 'normal',
    fontWeight: fontWeight.light,
  },
  POPPINS_MEDIUM: {
    fontFamily: 'Poppins-Medium, Segoe UI Emoji, Noto Color Emoji',
    fontStyle: 'normal',
    fontWeight: fontWeight.medium,
  },
  POPPINS_REGULAR: {
    fontFamily: 'Poppins-Regular, Segoe UI Emoji, Noto Color Emoji',
    fontStyle: 'normal',
    fontWeight: fontWeight.normal,
  },
  RALEWAY_BLACK: {
    fontFamily: 'Raleway-Black, Segoe UI Emoji, Noto Color Emoji',
    fontStyle: 'normal',
    fontWeight: fontWeight.black,
  },
  RALEWAY_BOLD: {
    fontFamily: 'Raleway-Bold, Segoe UI Emoji, Noto Color Emoji',
    fontStyle: 'normal',
    fontWeight: fontWeight.bold,
  },
  RALEWAY_ITALIC: {
    fontFamily: 'Raleway-Italic, Segoe UI Emoji, Noto Color Emoji',
    fontStyle: 'italic',
    fontWeight: fontWeight.normal,
  },
  RALEWAY_LIGHT: {
    fontFamily: 'Raleway-Light, Segoe UI Emoji, Noto Color Emoji',
    fontStyle: 'normal',
    fontWeight: fontWeight.light,
  },
  RALEWAY_MEDIUM: {
    fontFamily: 'Raleway-Medium, Segoe UI Emoji, Noto Color Emoji',
    fontStyle: 'normal',
    fontWeight: fontWeight.medium,
  },
  RALEWAY_REGULAR: {
    fontFamily: 'Raleway-Regular, Segoe UI Emoji, Noto Color Emoji',
    fontStyle: 'normal',
    fontWeight: fontWeight.normal,
  },
};
