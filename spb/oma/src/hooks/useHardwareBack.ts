import { useCallback, useEffect, useState } from 'react';
import { BackHandler, ToastAndroid } from 'react-native';

import { RootParamList, RootScreens } from '@/screens';
import { TabStackList } from '@/screens/main/tab';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const useBackHandler = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootParamList & TabStackList>>();
  const [doubleBackToExitPressedOnce, setDoubleBackToExitPressedOnce] =
    useState(false);

  const handleDoubleBackPress = useCallback(() => {
    if (doubleBackToExitPressedOnce) {
      BackHandler.exitApp();
      return;
    }

    setDoubleBackToExitPressedOnce(true);
    ToastAndroid.show('Click back again to exit app', ToastAndroid.SHORT);

    setTimeout(() => {
      setDoubleBackToExitPressedOnce(false);
    }, 2000);
  }, [doubleBackToExitPressedOnce]);

  const handleBackPress = useCallback(() => {
    const state = navigation.getState();
    const currentTab = state?.routes?.[state?.index];
    if (!currentTab) {
      handleDoubleBackPress();
      return true;
    }

    if (currentTab.name === RootScreens.Auth) {
      handleDoubleBackPress();
      return true;
    }

    const currentTabStateIndex = currentTab.state?.index;
    if (
      currentTabStateIndex !== undefined &&
      currentTabStateIndex > 0 &&
      navigation.canGoBack()
    ) {
      navigation.goBack();
      return true;
    }

    if (!currentTabStateIndex) {
      handleDoubleBackPress();
      return true;
    }

    return false;
  }, [navigation, handleDoubleBackPress]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );
    return () => backHandler.remove();
  }, [handleBackPress]);
};

export default useBackHandler;
