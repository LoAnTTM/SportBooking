import React from 'react';
import VectorIcon from 'react-native-vector-icons/Feather';

import { IIconProps } from '@/ui/icon';

export interface IEyeOffIconProps extends Omit<IIconProps, 'name'> {}

const EyeOffIcon: React.FC<IEyeOffIconProps> = ({ color, size }) => {
  return <VectorIcon name="eye-off" size={size} color={color} />;
};

export default EyeOffIcon;
