import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchBar from '@/components/home/SearchBar';
import UnitTabView from '@/components/home/UnitTabView';
import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme.context';
import { hp } from '@/helpers/dimensions';

const HomeScreen: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const unitTabs = [
    {
      key: '1',
      component: <View />,
      title: 'Near Me',
      icon: 'location-outline',
    },
    {
      key: '2',
      component: <View />,
      title: 'Popular',
      icon: 'star-outline',
    },
  ];

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>
        <SearchBar />
        <UnitTabView routes={unitTabs} />
      </View>
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
      backgroundColor: theme.backgroundDark,
      gap: hp(2),
    },
  });
};

export default HomeScreen;
