import { useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import { DEFAULT_REVERSE_GEOCODE } from '@/constants';
import { logError } from '@/helpers/logger';
import { useLocationStore } from '@/zustand';
import { OPENCAGE_API_KEY } from '@env';

export const reverseGeocode = async (lat: number, lon: number) => {
  try {
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}`
    );
    const data = await res.json();
    const address = data.results?.[0]?.formatted ?? 'Unknown address';
    const city = data.results?.[0]?.components?.city ?? 'Unknown city';

    return { address, city };
  } catch (err) {
    if (err instanceof Error) {
      logError(err, 'Reverse geocoding error');
    }
    return { address: 'Unknown address', city: 'Unknown city' };
  }
};

export const getPosition = () => {
  return new Promise<{ latitude: number; longitude: number }>(
    (resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    }
  );
};

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

    const updateAddress = async (lat: number, lon: number) => {
      const { address, city } = await reverseGeocode(lat, lon);
      setAddress(address, city);
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
            updateAddress(latitude, longitude);
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

      // Reverse geocode every 1 hour
      intervalId = setInterval(() => {
        if (latestCoords.current) {
          updateAddress(
            latestCoords.current.latitude,
            latestCoords.current.longitude
          );
        }
      }, DEFAULT_REVERSE_GEOCODE); // 1 hour
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
