import { StatusBar } from 'expo-status-bar'
import Navigation from '@/navigation'
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useThemeToggle } from '@/hooks/themes';


export default function App() {
  const { theme, toggleTheme } = useThemeToggle();

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <Navigation />
        <StatusBar />
      </SafeAreaProvider>
    </PaperProvider>
  )
}
