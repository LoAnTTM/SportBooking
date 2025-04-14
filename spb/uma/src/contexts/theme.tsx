import React, { createContext, useState } from 'react';
import { Appearance } from 'react-native';

import { Color } from '@/constants';

export const ThemeContext = createContext({
  theme: Color.dark || Color.light,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorTheme] = useState(
    Appearance.getColorScheme() || 'light'
  );
  const theme = colorTheme === 'light' ? Color.light : Color.dark;
  const toggleTheme = () => {
    setColorTheme(colorTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
