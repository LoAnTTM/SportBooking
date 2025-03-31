import React, { FC, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VectorIcon from 'react-native-vector-icons/AntDesign';

import ConfirmForgotPasswordForm from '@/components/auth/ConfirmForgotPasswordForm';
import { DEFAULT_ICON_SIZE, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme.context';
import { hp, wp } from '@/helpers/dimensions';
import { ParamList } from '@/screens';
import BackButton from '@/ui/button/Back';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  route?: RouteProp<ParamList, 'ConfirmForgotPassword'>;
};

const ConfirmForgotPassword: FC<Props> = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>();
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
