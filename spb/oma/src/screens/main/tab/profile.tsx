import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { RootParamList } from '@/screens';
import Button from '@/ui/button/BaseButton';
import { useAuthStore } from '@/zustand';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();

  const logout = useAuthStore((state) => state.logout);
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const logoutHandler = async () => {
    await logout();
    // delete all routes history
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };
  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <Button title="Logout" onPress={logoutHandler} />
    </View>
  );
};

const createStyles = (theme: IColorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundLight,
    },
  });
};

export default ProfileScreen;
