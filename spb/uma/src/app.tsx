import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';

import { useLocationTracking } from '@/hooks/useLocationTracking';
import AppProvider from '@/providers';
import RootStack from '@/screens';
import { useAuthStore, useLocationStore } from '@/zustand';
import { NavigationContainer } from '@react-navigation/native';

const App: React.FC = () => {
  const checkIsLoggedIn = useAuthStore.use.checkIsLoggedIn();
  const loadPreviousAddress = useLocationStore.use.loadPreviousAddress();

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
