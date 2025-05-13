import React, { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import MapLocationButton from '@/components/common/MapLocationButton';
import { IColorScheme, ZOOM_LEVEL } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp } from '@/helpers/dimensions';
import { GeographyModel } from '@/types/model';
import { useLocationStore } from '@/zustand';
import Mapbox, { CameraStop, StyleURL } from '@rnmapbox/maps';

import MapMarker from './MapMarker';

interface MapViewProps {
  scrollEnabled?: boolean;
  height?: number;
  coordinates?: GeographyModel;
  showUserLocation?: boolean;
  onMapTouchStart?: () => void;
  onMapPress: (feature: GeoJSON.Feature) => void;
}

const MapView: FC<MapViewProps> = ({
  scrollEnabled = true,
  height,
  coordinates,
  showUserLocation = true,
  onMapTouchStart,
  onMapPress,
}) => {
  const mapRef = useRef<Mapbox.MapView>(null);
  const cameraRef = useRef<Mapbox.Camera>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [currentCoordinates, setCurrentCoordinates] =
    useState<GeographyModel>();

  const latitude = useLocationStore((state) => state.latitude);
  const longitude = useLocationStore((state) => state.longitude);

  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme, height);

  const moveToLocation = useRef(
    (lat: number, lng: number, zoomLevel?: number | undefined) => {
      if (!cameraRef.current) return;

      const cameraConfig: CameraStop = {
        centerCoordinate: [lng, lat],
        animationDuration: 500,
        animationMode: 'flyTo',
      };

      if (zoomLevel) {
        cameraConfig.zoomLevel = zoomLevel;
      }
      cameraRef.current.setCamera(cameraConfig);
    }
  ).current;

  const initialLocation = useCallback(() => {
    console.log(currentCoordinates);
    if (!mapRef.current || !currentCoordinates) return;
    moveToLocation(
      currentCoordinates.latitude,
      currentCoordinates.longitude,
      ZOOM_LEVEL
    );
  }, [currentCoordinates, moveToLocation]);

  useEffect(() => {
    if (coordinates) {
      setCurrentCoordinates({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
    } else {
      setCurrentCoordinates({
        latitude,
        longitude,
      });
    }
  }, [latitude, longitude, coordinates]);

  useEffect(() => {
    if (mapLoaded) {
      initialLocation();
    }
  }, [mapLoaded, initialLocation]);

  return (
    <View style={styles.container}>
      <View style={styles.containerMap} onTouchStart={onMapTouchStart}>
        <Mapbox.MapView
          ref={mapRef}
          style={styles.map}
          styleURL={StyleURL.Light}
          testID={'unit-map'}
          zoomEnabled
          scrollEnabled={scrollEnabled}
          logoEnabled={false}
          pitchEnabled
          rotateEnabled
          attributionEnabled={false}
          scaleBarEnabled={false}
          onDidFinishLoadingMap={() => setMapLoaded(true)}
          onPress={onMapPress}
        >
          <Mapbox.Camera ref={cameraRef} />
          {showUserLocation && (
            <Mapbox.UserLocation
              visible={true}
              showsUserHeadingIndicator={true}
              androidRenderMode="gps"
              minDisplacement={1}
              requestsAlwaysUse={true}
            />
          )}
          {currentCoordinates &&
            <MapMarker
              key={'owner_map'}
              id={'owner_map'}
              coord={currentCoordinates}
            />
          }
        </Mapbox.MapView>
        <MapLocationButton
          onPress={() => moveToLocation(latitude, longitude)}
          containerStyle={styles.gpsButton}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: IColorScheme, height?: number) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: height || hp(40),
    },
    containerMap: {
      position: 'relative',
      flex: 1,
    },
    map: {
      flex: 1,
    },
    gpsButton: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      borderRadius: 24,
      backgroundColor: theme.primary,
    },
    containerSlider: {
      width: '100%',
      height: hp(24),
      marginBottom: hp(1),
    },
  });

export default React.memo(MapView);
