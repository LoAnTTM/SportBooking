import { Platform } from 'react-native';

interface ShadowProps {
  color?: string;
  opacity?: number;
  radius?: number;
  elevation?: number;
  offset?: {
    width: number;
    height: number;
  };
}

export const createShadow = ({
  color = '#000',
  opacity = 0.25,
  radius = 3.84,
  elevation = 5,
  offset = {
    width: 0,
    height: 2,
  },
}: ShadowProps = {}) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: color,
      shadowOffset: offset,
      shadowOpacity: opacity,
      shadowRadius: radius,
    };
  }

  return {
    elevation,
  };
};
