import React, { FC, useCallback, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import LocationInfo from '@/components/common/LocationInfo';
import NotificationBell from '@/components/common/NotificationBell';
import SearchBar from '@/components/common/SearchBar';
import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp } from '@/helpers/dimensions';
import { useLocationStore } from '@/zustand';

const Header: FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const address = useLocationStore((state) => state.address);
  const city = useLocationStore((state) => state.city);
  const updateAddress = useLocationStore((state) => state.updateAddress);

  const handleLocationPress = useCallback(() => {
    updateAddress();
  }, [updateAddress]);

  const handleNotificationPress = useCallback(() => {
    console.log('Notifications pressed');
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <LocationInfo
          title={city as string}
          subtitle={address as string}
          onPress={handleLocationPress}
        />
        {/* <NotificationBell
          color={theme.icon}
          hasNotifications={true}
          onPress={handleNotificationPress}
        /> */}
      </View>
      <SearchBar />
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.backgroundLight,
      width: '100%',
      paddingHorizontal: hp(2),
      paddingTop: hp(2),
      paddingBottom: hp(2),
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
      zIndex: 1,
    },
    topBar: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(2),
    },
    searchContainer: {
      width: '100%',
    },
  });

export default React.memo(Header);
