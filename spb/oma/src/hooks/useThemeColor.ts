import { useColorScheme } from 'react-native';

import { Color } from '@/constants';

function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Color.light & keyof typeof Color.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Color[theme][colorName];
  }
}

export default useThemeColor;
