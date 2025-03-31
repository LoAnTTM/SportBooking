import React from 'react';
import VectorIcon from 'react-native-vector-icons/Feather';

import { IIconProps } from '@/ui/icon';

export interface IEyeIconProps extends Omit<IIconProps, 'name'> {}

const EyeIcon: React.FC<IEyeIconProps> = ({ color, size }) => {
  return <VectorIcon name="eye" size={size} color={color} />;
};

export default EyeIcon;
