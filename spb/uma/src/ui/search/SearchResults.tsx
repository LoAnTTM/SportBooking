import React, { useContext } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';

interface SearchResultsProps {
  results: string[];
  fadeAnim: Animated.Value;
  styles: any;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  fadeAnim,
}) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {results.map((result, index) => (
        <Text key={index} style={styles.resultText}>
          {result}
        </Text>
      ))}
    </Animated.View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    resultText: {
      paddingVertical: 5,
    },
    resultPanel: {
      marginTop: 10,
      borderWidth: 1,
      borderColor: theme.borderLight,
      borderRadius: 5,
      padding: 10,
    },
  });
