import React, { FC, useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VectorIcon from 'react-native-vector-icons/Ionicons';

import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme.context';
import { hp, wp } from '@/helpers/dimensions';
import { logError } from '@/helpers/logger';
import { ParamList } from '@/screens';
import BackButton from '@/ui/button/Back';
import { useAuthStore } from '@/zustand';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const ForgotPassword: FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>();
  const forgotPassword = useAuthStore.use.forgotPassword();
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const handleSubmit = async (data: { email: string }) => {
    try {
      await forgotPassword(data);
    } catch (error) {
      logError(error as Error);
    } finally {
      navigation.navigate('VerifyForgotPassword', { email: data.email });
    }
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <BackButton
            icon={<VectorIcon name="close" color={theme.icon} size={20} />}
          />
        </View>
        <ForgotPasswordForm theme={theme} onSubmit={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: IColorScheme) => {
  return StyleSheet.create({
    safeView: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: theme.backgroundLight,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    header: {
      height: hp(12),
      paddingVertical: hp(2),
      paddingHorizontal: wp(4),
    },
  });
};

export default ForgotPassword;
