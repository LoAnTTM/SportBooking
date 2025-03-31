import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VectorIcon from 'react-native-vector-icons/Ionicons';

import VerifyRegisterForm from '@/components/auth/VerifyRegisterForm';
import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme.context';
import { hp } from '@/helpers/dimensions';
import { ParamList } from '@/screens';
import BackButton from '@/ui/button/Back';
import { RouteProp } from '@react-navigation/native';

type Props = {
  route?: RouteProp<ParamList, 'VerifyRegister'>;
};

const VerifyRegister: React.FC<Props> = ({ route }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const email = route?.params.email || '';

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton
            icon={<VectorIcon name="close" color={theme.icon} size={20} />}
          />
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
