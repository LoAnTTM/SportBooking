import React from 'react';
import { Animated, Text } from 'react-native';

import { SearchStyleProps } from './types';

interface SearchResultsProps extends SearchStyleProps {
  results: string[];
  fadeAnim: Animated.Value;
  styles: any;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  fadeAnim,
  styles,
  resultPanelStyle,
}) => (
  <Animated.View
    style={[styles.resultPanel, resultPanelStyle, { opacity: fadeAnim }]}
  >
    {results.map((result, index) => (
      <Text key={index} style={styles.resultText}>
        {result}
      </Text>
    ))}
  </Animated.View>
);
