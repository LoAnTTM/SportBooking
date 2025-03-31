import React from 'react';
import { DimensionValue, StyleSheet, Text, View } from 'react-native';

import { fontFamily, fontSize, IColorScheme } from '@/constants';

interface ILineProps {
  isHorizontal?: boolean;
  title?: string;
  theme: IColorScheme;
  width?: DimensionValue;
}

const Line: React.FC<ILineProps> = ({ title, theme, width }) => {
  const styles = createStyles(theme, width);
  return (
    <View style={styles.line}>
      {!!title && <Text style={styles.title}>{title}</Text>}
    </View>
  );
};

const createStyles = (theme: IColorScheme, width?: DimensionValue) =>
  StyleSheet.create({
    line: {
      height: 1,
      width: width || '95%',
      margin: 'auto',
      backgroundColor: theme.borderLight,
    },
    title: {
      ...fontFamily.RALEWAY_REGULAR,
      fontSize: fontSize.sm,
      color: theme.textLight,
      backgroundColor: theme.backgroundLight,
      position: 'absolute',
      display: 'flex',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      paddingHorizontal: '2%',
    },
  });

export default Line;
