import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';

import AppProvider from '@/providers';
import RootStack from '@/screens';
import { useAuthStore } from '@/zustand';
import { NavigationContainer } from '@react-navigation/native';

const App: React.FC = () => {
  const checkIsLoggedIn = useAuthStore.use.checkIsLoggedIn();

  useEffect(() => {
    checkIsLoggedIn();
  }, [checkIsLoggedIn]);

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
