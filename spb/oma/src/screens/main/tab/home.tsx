import React, { FC, useContext, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import BookingChart from '@/components/club/BookingChart';
import ClubInfo from '@/components/club/ClubInfo';
import UnitsList from '@/components/club/UnitsList';
import Header from '@/components/common/Header';
import HeaderWithBack from '@/components/common/HeaderWithBack';
import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import { mockClub } from '@/mock/club';
import { MainStackParamList } from '@/screens/main';
import { Unit } from '@/types/club';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const ClubHomeScreen: FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const [refreshing, setRefreshing] = useState(false);
  const [club, setClub] = useState(mockClub);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, this would fetch updated data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Handle edit club
  const handleEditClub = () => {
    navigation.navigate('ClubManagement');
  };

  // Handle unit press
  const handleUnitPress = (unit: Unit) => {
    // Navigate to unit detail or edit screen
    navigation.navigate('UnitManagement');
  };

  // Handle add unit
  const handleAddUnit = () => {
    navigation.navigate('UnitManagement');
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      >
        {/* Club Info Section */}
        <ClubInfo club={club} theme={theme} onEditPress={handleEditClub} />

        {/* Booking Chart Section */}
        <BookingChart theme={theme} />

        {/* Units List Section */}
        <UnitsList
          units={club.units}
          theme={theme}
          onUnitPress={handleUnitPress}
          onAddUnitPress={handleAddUnit}
        />
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundLight,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: wp(4),
      paddingBottom: hp(4),
    },
  });

export default ClubHomeScreen;
