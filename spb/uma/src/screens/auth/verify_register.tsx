import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import VerifyRegisterForm from '@/components/auth/VerifyRegisterForm';
import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp } from '@/helpers/dimensions';
import { AuthStackParamList } from '@/screens/auth';
import BackButton from '@/ui/button/Back';
import LeftIcon from '@/ui/icon/Left';
import { RouteProp } from '@react-navigation/native';

type Props = {
  route?: RouteProp<AuthStackParamList, 'VerifyRegister'>;
};

const VerifyRegister: React.FC<Props> = ({ route }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const email = route?.params.email || '';

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton icon={<LeftIcon color={theme.icon} />} />
        </View>
        <VerifyRegisterForm email={email} />
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
      padding: hp(2),
    },
  });

export default VerifyRegister;
