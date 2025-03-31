import { Dimensions, ScaledSize } from 'react-native';

const { width, height }: ScaledSize = Dimensions.get('window');
export const hp = (percent: number) => (height * percent) / 100;
export const wp = (percent: number) => (width * percent) / 100;
