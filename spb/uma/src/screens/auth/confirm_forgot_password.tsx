import React, { FC, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ConfirmForgotPasswordForm from '@/components/auth/ConfirmForgotPasswordForm';
import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import { AuthStackParamList } from '@/screens/auth';
import BackButton from '@/ui/button/Back';
import LeftIcon from '@/ui/icon/Left';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  route?: RouteProp<AuthStackParamList, 'ConfirmForgotPassword'>;
};

const ConfirmForgotPassword: FC<Props> = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const email = route?.params.email || '';
  const token = route?.params.token || 0;

  const handleSubmit = () => {
    navigation.navigate('ResetPassword', { email, token });
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton icon={<LeftIcon color={theme.icon} />} />
        </View>
        <ConfirmForgotPasswordForm theme={theme} onSubmit={handleSubmit} />
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
export default ConfirmForgotPassword;
