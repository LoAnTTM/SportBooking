import { useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import { DEFAULT_REVERSE_GEOCODE } from '@/constants';
import { logError } from '@/helpers/logger';
import { useLocationStore } from '@/zustand';
import { OPENCAGE_API_KEY } from '@env';

export const useLocationTracking = () => {
  const setLocation = useLocationStore((state) => state.setLocation);
  const setAddress = useLocationStore((state) => state.setAddress);
  const latestCoords = useRef<{ latitude: number; longitude: number } | null>(
    null
  );

  useEffect(() => {
    let watchId: number | null = null;
    let hasInitialLocation = false;
    let intervalId: ReturnType<typeof setInterval> | null;

    const reverseGeocode = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}`
        );
        const data = await res.json();
        const address = data.results?.[0]?.formatted ?? 'Unknown address';
        const city = data.results?.[0]?.components?.city ?? 'Unknown city';

        setAddress(address, city);
      } catch (err) {
        if (err instanceof Error) {
          logError(err, 'Reverse geocoding error');
        }
      }
    };

    const start = async () => {
      const granted = await requestPermission();
      if (!granted) return;

      // Start watch
      watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          latestCoords.current = { latitude, longitude };
          setLocation(latitude, longitude);

          if (!hasInitialLocation) {
            hasInitialLocation = true;
            reverseGeocode(latitude, longitude);
          }
        },
        (error) => {
          if (error instanceof Error) {
            logError(error, 'Error watching position');
          }
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 10000,
          fastestInterval: 5000,
        }
      );

      // Reverse geocode every 15 mins
      intervalId = setInterval(() => {
        if (latestCoords.current) {
          reverseGeocode(
            latestCoords.current.latitude,
            latestCoords.current.longitude
          );
        }
      }, DEFAULT_REVERSE_GEOCODE); // 15 minutes
    };

    start();

    return () => {
      if (watchId !== null) Geolocation.clearWatch(watchId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [setLocation, setAddress]);
};

const requestPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};
