import React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import Toast, {
  BaseToast,
  BaseToastProps,
  ErrorToast,
  ToastProps,
} from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  DEFAULT_ICON_SIZE,
  fontFamily,
  fontSize,
  IColorScheme,
} from '@/constants';
import { hp } from '@/helpers/dimensions';

// Types
interface ToastStyles {
  container: ViewStyle;
  content: ViewStyle;
  text1: TextStyle;
  text2?: TextStyle;
}

interface ToastIconProps {
  color: string;
  name: string;
  size: number;
  IconComponent: typeof AntDesign | typeof MaterialIcons;
}

const TOAST_CONFIG = {
  success: {
    iconProps: {
      name: 'check',
      size: DEFAULT_ICON_SIZE,
      IconComponent: AntDesign,
    },
    textStyles: {
      text1: fontFamily.RALEWAY_BOLD,
      text2: fontFamily.POPPINS_REGULAR,
    },
  },
  error: {
    iconProps: {
      name: 'error-outline',
      size: DEFAULT_ICON_SIZE,
      IconComponent: MaterialIcons,
    },
    textStyles: {
      text1: fontFamily.RALEWAY_BOLD,
      text2: fontFamily.POPPINS_REGULAR,
    },
  },
} as const;

const ToastIcon: React.FC<ToastIconProps> = ({
  color,
  name,
  size,
  IconComponent,
}) => {
  const styles = StyleSheet.create({
    iconContainer: {
      height: '100%',
      width: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.iconContainer}>
      <IconComponent name={name} size={size} color={color} />
    </View>
  );
};

// Helper functions
const createToastStyles = (
  theme: IColorScheme,
  type: 'success' | 'error'
): ToastStyles => {
  const baseStyles: ToastStyles = {
    container: {
      borderLeftColor: theme[type],
      borderLeftWidth: 6,
      borderRadius: 0,
      height: hp(6.6),
    },
    content: {
      paddingHorizontal: hp(2),
    },
    text1: {
      ...TOAST_CONFIG[type].textStyles.text1,
      fontSize: fontSize.sm,
    },
  };

  if (TOAST_CONFIG[type].textStyles.text2) {
    baseStyles.text2 = {
      ...TOAST_CONFIG[type].textStyles.text2,
      fontSize: fontSize.sm,
    };
  }

  return baseStyles;
};

// Main toast configuration
export const toastConfig = (theme: IColorScheme) => ({
  success: (props: BaseToastProps): React.ReactNode => {
    const styles = createToastStyles(theme, 'success');
    const { name, size, IconComponent } = TOAST_CONFIG.success.iconProps;

    return (
      <BaseToast
        {...props}
        style={styles.container}
        contentContainerStyle={styles.content}
        text1Style={styles.text1}
        onPress={() => Toast.hide()}
        renderLeadingIcon={() => (
          <ToastIcon
            color={theme.success}
            name={name}
            size={size}
            IconComponent={IconComponent}
          />
        )}
      />
    );
  },
  error: (props: ToastProps) => {
    const styles = createToastStyles(theme, 'error');
    const { name, size, IconComponent } = TOAST_CONFIG.error.iconProps;

    return (
      <ErrorToast
        {...props}
        style={styles.container}
        contentContainerStyle={styles.content}
        text1Style={styles.text1}
        text2Style={styles.text2}
        onPress={() => Toast.hide()}
        renderLeadingIcon={() => (
          <ToastIcon
            color={theme.error}
            name={name}
            size={size}
            IconComponent={IconComponent}
          />
        )}
      />
    );
  },
});

// Toast helper functions
export const showToast = (
  type: 'success' | 'error',
  text1: string,
  text2?: string
) => {
  Toast.show({ type, text1, text2 });
};

export const toastSuccess = (text1: string, text2?: string) =>
  showToast('success', text1, text2);
export const toastError = (text1: string, text2?: string) =>
  showToast('error', text1, text2);
