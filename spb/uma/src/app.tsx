import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import { useLocationTracking } from '@/hooks/useLocationTracking';
import AppProvider from '@/providers';
import RootStack from '@/screens';
import { useAuthStore, useLanguageStore, useLocationStore } from '@/zustand';
import { MAPBOX_ACCESS_TOKEN } from '@env';
import { NavigationContainer } from '@react-navigation/native';
import Mapbox from '@rnmapbox/maps';

// Disable all error and warning logs
LogBox.ignoreAllLogs();

const App: React.FC = () => {
  const checkIsLoggedIn = useAuthStore(state => state.checkIsLoggedIn);
  const loadPreviousAddress = useLocationStore(state => state.loadPreviousAddress);
  const initializeLanguage = useLanguageStore(state => state.initializeLanguage);

  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

  // Location tracking hook
  useLocationTracking();

  useEffect(() => {
    checkIsLoggedIn();
    loadPreviousAddress();
    initializeLanguage();
  }, [checkIsLoggedIn, loadPreviousAddress, initializeLanguage]);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <AppProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
