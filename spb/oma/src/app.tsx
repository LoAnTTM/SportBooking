import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';

import { useLocationTracking } from '@/hooks/useLocationTracking';
import AppProvider from '@/providers';
import RootStack from '@/screens';
import { useAuthStore, useLocationStore } from '@/zustand';
import { MAPBOX_ACCESS_TOKEN } from '@env';
import { NavigationContainer } from '@react-navigation/native';
import Mapbox from '@rnmapbox/maps';

const App: React.FC = () => {
  const checkIsLoggedIn = useAuthStore(state => state.checkIsLoggedIn);
  const loadPreviousAddress = useLocationStore(state => state.loadPreviousAddress);

  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

  // Location tracking hook
  useLocationTracking();

  useEffect(() => {
    checkIsLoggedIn();
    loadPreviousAddress();
  }, [checkIsLoggedIn, loadPreviousAddress]);

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
