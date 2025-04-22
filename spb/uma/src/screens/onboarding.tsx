import React, { useContext } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Color, fontFamily, fontSize, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import i18next from '@/helpers/i18n';
import { RootParamList } from '@/screens';
import Button from '@/ui/button/BaseButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const OnBoarding: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const handleSubmit = () => {
    navigation.navigate('Auth');
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          resizeMode="contain"
          source={require('../../assets/images/welcome.png')}
        />
        <View style={styles.footer}>
          <Button
            buttonStyle={styles.button}
            textStyles={styles.buttonText}
            title={i18next.t('onboarding.get_started')}
            onPress={handleSubmit}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (_: IColorScheme) => {
  return StyleSheet.create({
    safeView: {
      flex: 1,
    },
    container: {
      height: '100%',
      width: '100%',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: Color.light.backgroundLight,
      paddingHorizontal: wp(4),
    },
    image: {
      width: wp(100),
      height: hp(45),
    },
    footer: {
      gap: hp(2),
      width: '100%',
    },
    button: {
      marginTop: 10,
    },
    buttonText: {
      ...fontFamily.RALEWAY_REGULAR,
      fontSize: fontSize.sm,
    },
  });
};

export default OnBoarding;
