import React, { FC, useContext, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/shallow';

import ClubInfo from '@/components/club/ClubInfo';
import UnitsList from '@/components/club/UnitsList';
import Header from '@/components/common/Header';
import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import { MainStackParamList } from '@/screens/main';
import { useAuthStore, useClubStore, useLocationStore, useSportTypeStore } from '@/zustand';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const ClubHomeScreen: FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const [refreshing, setRefreshing] = useState(false);
  const fetchClubByOwner = useClubStore((state) => state.fetchClubByOwner);
  const club = useClubStore(useShallow((state) => state.club));
  const userId = useAuthStore(useShallow((state) => state.userId));
  const fetchSportTypes = useSportTypeStore((state) => state.fetchSportTypes);
  const getProvince = useLocationStore((state) => state.getProvince);
  const getDistrict = useLocationStore((state) => state.getDistrict);
  const getWard = useLocationStore((state) => state.getWard);

  useEffect(() => {
    fetchClubByOwner(userId);
    fetchSportTypes();
  }, [fetchClubByOwner]);

  useEffect(() => {
    if (club?.address) {
      getProvince();
    }
    if (club?.address?.provinceId) {
      getDistrict(club.address.provinceId);
    }
    if (club?.address?.districtId) {
      getWard(club.address.districtId);
    }
  }, [getProvince, getDistrict, getWard, club]);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchClubByOwner(userId).then(() => {
      setRefreshing(false);
    });
  };

  // Handle edit club
  const handleEditClub = () => {
    navigation.navigate('ClubManagement');
  };

  // Handle add unit
  const handleManageUnitPress = () => {
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
        {club?.id && (
          <ClubInfo club={club} theme={theme} onEditPress={handleEditClub} />
        )}

        {/* Units List Section */}
        <UnitsList
          units={club.units}
          theme={theme}
          onManageUnitPress={handleManageUnitPress}
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
