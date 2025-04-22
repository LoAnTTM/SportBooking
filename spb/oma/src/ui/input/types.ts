import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface IInputProps {
  type: 'text' | 'password';
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  onBlur?: (e: any) => void;
  onSubmitEditing?: (e: any) => void;
  error: boolean;
  autoFocus?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}
