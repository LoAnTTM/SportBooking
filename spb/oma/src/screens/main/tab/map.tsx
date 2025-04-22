import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import SearchBar from '@/components/common/SearchBar';
import MapView from '@/components/map/MapView';
import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp } from '@/helpers/dimensions';
import { TabParamList } from '@/screens/main/tab';
import { RouteProp } from '@react-navigation/native';

type MapScreenProps = {
  route?: RouteProp<TabParamList, 'Map'>;
};

const MapScreen: React.FC<MapScreenProps> = ({ route }) => {
  const unitId = route?.params?.unitId;
  const renderType = route?.params?.renderType;

  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <SearchBar containerStyle={styles.floatingSearchBar} />
      <MapView unitId={unitId} renderType={renderType} />
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      backgroundColor: theme.backgroundLight,
      flexDirection: 'column',
    },
    floatingSearchBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      paddingHorizontal: hp(2),
      paddingTop: hp(2),
    },
  });

export default React.memo(MapScreen);
