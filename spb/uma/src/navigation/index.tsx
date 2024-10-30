import LoginScreen from '@/screens/auth/login.screen'
import RegisterScreen from '@/screens/auth/register.screen'
import OnboardingScreen from '@/screens/onboarding/onboarding.screen'
import ChangePasswordScreen from '@/screens/auth/changePassword.screen'
import ResetPasswordScreen from '@/screens/auth/resetPassword.screen'
import Home from '@/screens/home/home.screen'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { View, Switch } from 'react-native'
import { useThemeToggle } from '@/hooks/themes';
import React from 'react'

// Define the types for the navigation stack
export type RootStackParamList = {
  Onboarding: undefined
  Login: undefined
  Register: undefined
  ChangePassword: undefined
  ResetPassword: undefined
  Home: undefined
}

// Create the stack navigator with types
const Stack = createStackNavigator<RootStackParamList>()

export default function Navigation() {
  const { isDarkTheme, toggleTheme } = useThemeToggle();
  return (
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName="Onboarding"
      screenOptions={{
        headerRight: () => (
          <View style={{ marginRight: 10 }}>
            <Switch value={isDarkTheme} onValueChange={toggleTheme} />
          </View>
        ),
      }}
    >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
