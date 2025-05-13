import React, { FC, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { DEFAULT_ICON_SIZE } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { GeographyModel } from '@/types/model';
import FullFillLocationIcon from '@/ui/icon/FullFillLocation';
import Mapbox from '@rnmapbox/maps';

interface MapMarkerProps {
  coord: GeographyModel;
  id: string;
}

const MapMarker: FC<MapMarkerProps> = ({ coord, id }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <Mapbox.PointAnnotation
      id={`marker-${id}`}
      coordinate={[coord.longitude, coord.latitude]}
    >
      <View style={[styles.markerContainer]}>
        <FullFillLocationIcon color={theme.red} size={DEFAULT_ICON_SIZE + 12} />
      </View>
    </Mapbox.PointAnnotation>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MapMarker;
