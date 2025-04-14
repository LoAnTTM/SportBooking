import React, { useContext, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import EyeIcon from '@/ui/icon/Eye';
import EyeOffIcon from '@/ui/icon/EyeOff';
import { IInputProps } from '@/ui/input/types';

const Input: React.FC<IInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChangeText,
  error,
  ...props
}) => {
  const { theme } = useContext(ThemeContext);
  const [showPassword, setShowPassword] = useState(false);
  const styles = createStyles(theme, error);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme.borderDark}
        onChangeText={onChangeText}
        secureTextEntry={type === 'password' && !showPassword}
        {...props}
      />
      {type === 'password' && (
        <TouchableOpacity
          style={styles.rightIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeIcon color={theme.icon} size={20} />
          ) : (
            <EyeOffIcon color={theme.icon} size={20} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (theme: IColorScheme, hasError: boolean) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderCurve: 'continuous',
      borderColor: hasError ? theme.error : theme.borderLight,
      borderWidth: 1,
      borderRadius: Radius.xs,
    },
    input: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      paddingHorizontal: wp(4),
      color: theme.textDark,
      height: hp(6),
      flex: 1,
    },
    rightIcon: {
      width: hp(6),
      height: hp(6),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default Input;
