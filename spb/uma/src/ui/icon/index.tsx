import React from 'react';
import VectorIcon from 'react-native-vector-icons/FontAwesome';

export interface IIconProps {
  name: string;
  size?: number;
  color?: string;
}

const Icon: React.FC<IIconProps> = ({ name, size, color }) => {
  return <VectorIcon name={name} size={size} color={color} />;
};

export default Icon;
