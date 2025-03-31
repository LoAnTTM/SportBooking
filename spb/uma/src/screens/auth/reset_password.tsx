import React, { FC, useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VectorIcon from 'react-native-vector-icons/AntDesign';

import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { DEFAULT_ICON_SIZE, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme.context';
import { hp, wp } from '@/helpers/dimensions';
import { ResponseError } from '@/helpers/error';
import { logError } from '@/helpers/logger';
import { toastError } from '@/helpers/toast';
import { ParamList } from '@/screens';
import BackButton from '@/ui/button/Back';
import { useAuthStore } from '@/zustand';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  route?: RouteProp<ParamList, 'ConfirmForgotPassword'>;
};

const ResetPassword: FC<Props> = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>();
  const resetPassword = useAuthStore.use.resetPassword();
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const email = route?.params.email || '';
  const token = route?.params.token || 0;

  const handleSubmit = async (data: { password: string }) => {
    try {
      await resetPassword({
        email,
        password: data.password,
        token,
      });

      navigation.navigate('ConfirmResetPassword');
    } catch (err) {
      logError(err as ResponseError);
      toastError((err as ResponseError).message);
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
            icon={
              <VectorIcon
                name="left"
                color={theme.icon}
                size={DEFAULT_ICON_SIZE}
              />
            }
          />
        </View>
        <ResetPasswordForm theme={theme} onSubmit={handleSubmit} />
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
export default ResetPassword;
