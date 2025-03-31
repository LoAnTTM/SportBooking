import React, { FC, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ConfirmResetPasswordForm from '@/components/auth/ConfirmResetPasswordForm';
import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme.context';
import { hp, wp } from '@/helpers/dimensions';
import { ParamList } from '@/screens';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const ConfirmResetPassword: FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>();
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const handleSubmit = () => {
    navigation.navigate('Auth');
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>
        <View style={styles.header} />
        <ConfirmResetPasswordForm theme={theme} onSubmit={handleSubmit} />
      </View>
    </SafeAreaView>
  );
};
const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    safeView: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: theme.backgroundLight,
    },
    header: {
      height: hp(12),
      paddingVertical: hp(2),
      paddingHorizontal: wp(4),
    },
  });
export default ConfirmResetPassword;
