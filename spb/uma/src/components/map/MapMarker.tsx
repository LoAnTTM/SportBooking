import React, { FC, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { DEFAULT_ICON_SIZE } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { GeographyModel } from '@/types/model';
import FullFillLocationIcon from '@/ui/icon/FullFillLocation';
import Mapbox from '@rnmapbox/maps';

interface MapMarkerProps {
  coord: GeographyModel;
  active: boolean;
  id: string;
  onSelectMarker: (id: string) => void;
}

const MapMarker: FC<MapMarkerProps> = ({
  coord,
  active,
  id,
  onSelectMarker,
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <Mapbox.PointAnnotation
      id={`marker-${id}`}
      coordinate={[coord.longitude, coord.latitude]}
      onSelected={() => onSelectMarker(id)}
    >
      <View style={[styles.markerContainer]}>
        <FullFillLocationIcon
          color={active ? theme.red : theme.blue}
          size={active ? DEFAULT_ICON_SIZE + 12 : DEFAULT_ICON_SIZE}
        />
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
