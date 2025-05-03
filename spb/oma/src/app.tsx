import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import { useLocationTracking } from '@/hooks/useLocationTracking';
import AppProvider from '@/providers';
import RootStack from '@/screens';
import { useAuthStore, useLanguageStore, useLocationStore } from '@/zustand';
import { NavigationContainer } from '@react-navigation/native';

const App: React.FC = () => {
  const checkIsLoggedIn = useAuthStore((state) => state.checkIsLoggedIn);
  const loadPreviousAddress = useLocationStore(
    (state) => state.loadPreviousAddress
  );
  const initializeLanguage = useLanguageStore(
    (state) => state.initializeLanguage
  );

  LogBox.ignoreAllLogs()

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
