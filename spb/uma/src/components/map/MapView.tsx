import React, { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import MapCard from '@/components/map/MapCard';
import UnitMapCardSkeleton from '@/components/map/MapCardSkeleton';
import MapLocationButton from '@/components/map/MapLocationButton';
import MapMarker from '@/components/map/MapMarker';
import MapSkeleton from '@/components/map/MapSkeleton';
import { IColorScheme, ZOOM_LEVEL } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import { MainStackParamList } from '@/screens/main';
import { UnitCard } from '@/services/types';
import Slider from '@/ui/slider/Slider';
import { UnitRenderTypes, useLocationStore, useUnitStore } from '@/zustand';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Mapbox, { CameraStop, StyleURL } from '@rnmapbox/maps';

interface MapViewProps {
  unitId?: string;
  renderType?: UnitRenderTypes;
}

const MapView: FC<MapViewProps> = ({
  unitId,
  renderType = UnitRenderTypes.POPULAR,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const isFocused = useIsFocused();
  const mapRef = useRef<Mapbox.MapView>(null);
  const cameraRef = useRef<Mapbox.Camera>(null);
  const [units, setUnits] = useState<UnitCard[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  const latitude = useLocationStore((state) => state.latitude);
  const longitude = useLocationStore((state) => state.longitude);
  const popularUnits = useUnitStore((state) => state.popularUnits);
  const nearByUnits = useUnitStore((state) => state.nearByUnits);
  const searchUnits = useUnitStore((state) => state.searchUnits);

  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const moveToLocation = useRef(
    (lat: number, lng: number, zoomLevel?: number | undefined) => {
      if (!cameraRef.current || !isFocused) return;

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

  const initialLocation = useCallback(
    (initialId: string) => {
      if (!mapRef.current) return;
      const activeUnit = units.find((unit) => unit.id === initialId);

      if (!activeUnit) {
        moveToLocation(latitude, longitude, ZOOM_LEVEL);
        return;
      }
      moveToLocation(
        activeUnit.coords.latitude,
        activeUnit.coords.longitude,
        ZOOM_LEVEL
      );
    },
    [latitude, longitude, moveToLocation, units]
  );

  const handleSlideSelected = useCallback(
    (id: number) => {
      setActiveId(units[id].id);
    },
    [units]
  );

  const handlePressUnit = (id: string) => {
    navigation.navigate('Detail', {
      unitId: id,
    });
  };

  const isLoading = units === undefined || units.length === 0;

  const computedInitialPage = useMemo(() => {
    const newIndex = Math.max(
      0,
      units.findIndex((u) => u.id === activeId)
    );

    return newIndex;
  }, [units, activeId]);

  const handleSelectMarker = (id: string) => {
    setActiveId(id);
  };

  useEffect(() => {
    let initialId = '';
    switch (renderType) {
      case UnitRenderTypes.POPULAR:
        setUnits(popularUnits);
        initialId = popularUnits[0].id;
        break;
      case UnitRenderTypes.NEARBY:
        setUnits(nearByUnits);
        initialId = nearByUnits[0].id;
        break;
      case UnitRenderTypes.SEARCH:
        setUnits(searchUnits);
        initialId = searchUnits[0].id;
        break;
    }

    if (unitId) {
      initialId = unitId;
    }
    setActiveId(initialId);
  }, [popularUnits, nearByUnits, searchUnits, unitId, renderType, isFocused]);

  useEffect(() => {
    if (mapLoaded && activeId) {
      initialLocation(activeId);
    }
  }, [mapLoaded, activeId, initialLocation]);

  useEffect(() => {
    if (!isFocused) {
      setMapLoaded(false);
      setActiveId('');
      setUnits([]);
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {!isFocused && isLoading ? (
        <>
          <MapSkeleton />
          <UnitMapCardSkeleton key="key-1" />
        </>
      ) : (
        <>
          <View style={styles.containerMap}>
            <Mapbox.MapView
              ref={mapRef}
              style={styles.map}
              styleURL={StyleURL.Light}
              testID={'unit-map'}
              zoomEnabled
              scrollEnabled
              pitchEnabled
              rotateEnabled
              logoEnabled={false}
              attributionEnabled={false}
              scaleBarEnabled={false}
              onDidFinishLoadingMap={() => setMapLoaded(true)}
            >
              <Mapbox.Camera ref={cameraRef} />
              <Mapbox.UserLocation />
              {units.length > 0 &&
                units.map((unit) => (
                  <MapMarker
                    key={unit.id}
                    id={unit.id}
                    coord={unit.coords}
                    active={activeId === unit.id}
                    onSelectMarker={handleSelectMarker}
                  />
                ))}
            </Mapbox.MapView>
            <MapLocationButton
              onPress={() => moveToLocation(latitude, longitude)}
              containerStyle={styles.gpsButton}
            />
          </View>
          <Slider<UnitCard>
            data={units}
            containerStyle={styles.containerSlider}
            width={wp(100)}
            initialScrollIndex={computedInitialPage}
            onSlideSelected={handleSlideSelected}
            renderItem={({ item }) => (
              <MapCard
                unitCard={item}
                onPress={() => handlePressUnit(item.id)}
                onPressLocation={() => {
                  moveToLocation(item.coords.latitude, item.coords.longitude);
                }}
              />
            )}
          />
        </>
      )}
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
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

export default MapView;
