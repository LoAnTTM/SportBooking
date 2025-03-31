import React, { FC, ReactNode, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { ThemeContext, ThemeProvider } from '@/contexts/theme.context';
import { hp } from '@/helpers/dimensions';
import { toastConfig } from '@/helpers/toast';

export type ProviderProps = {
  children: ReactNode;
};

const AppProvider: FC<ProviderProps> = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        {children}
        <Toast
          config={toastConfig(theme)}
          position="bottom"
          bottomOffset={hp(10)}
        />
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
