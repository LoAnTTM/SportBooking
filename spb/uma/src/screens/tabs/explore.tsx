import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme.context';

const ExploreScreen: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text>explore</Text>
    </View>
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
    },
  });
};

export default ExploreScreen;
