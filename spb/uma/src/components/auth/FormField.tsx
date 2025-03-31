import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fontFamily, fontSize, IColorScheme } from '@/constants';
import Input from '@/ui/input/BaseInput';

interface FormFieldProps {
  title: string;
  value: string;
  error?: string;
  autoFocus?: boolean;
  touched?: boolean | undefined;
  theme: IColorScheme;
  handleChange: (text: string) => void;
  handleBlur?: (e: any) => void;
  type?: 'text' | 'password';
  keyboardType?: 'default' | 'email-address';
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  error,
  theme,
  touched,
  handleChange,
  handleBlur,
  autoFocus,
  type = 'text',
  keyboardType = 'default',
}) => {
  const styles = createStyles(theme);

  return (
    <View style={styles.formField}>
      <Input
        type={type}
        value={value}
        error={!!error && !!touched}
        autoFocus={autoFocus}
        onChangeText={handleChange}
        onBlur={handleBlur}
        placeholder={title}
        keyboardType={keyboardType}
      />
      {error && touched && <Text style={styles.errorMsg}>{error}</Text>}
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    formField: {
      width: '100%',
    },
    errorMsg: {
      color: theme.error,
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      position: 'absolute',
      bottom: -18,
      left: 10,
    },
  });

export default FormField;
