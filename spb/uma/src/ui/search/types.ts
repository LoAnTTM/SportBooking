import { TextStyle, ViewStyle } from 'react-native';

import { IColorScheme } from '@/constants';

export interface SearchStyleProps {
  containerStyle?: ViewStyle;
  searchBarStyle?: ViewStyle;
  inputStyle?: TextStyle;
  resultPanelStyle?: ViewStyle;
}

export interface SearchProps extends SearchStyleProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  results?: string[];
  theme: IColorScheme;
}
