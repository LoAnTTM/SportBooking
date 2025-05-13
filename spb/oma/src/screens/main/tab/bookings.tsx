import React, { FC, useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';
import { useShallow } from 'zustand/shallow';

import BookingItem from '@/components/booking/BookingItem';
import Header from '@/components/common/Header';
import UnitTab from '@/components/home/UnitTab';
import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import { UnitModel } from '@/types/model';
import CalendarIcon from '@/ui/icon/Calendar';
import { useClubStore, useOrderStore } from '@/zustand';

const BookingsScreen: FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const club = useClubStore(useShallow((state) => state.club));
  const getOrderByClub = useOrderStore((state) => state.getOrderByClub);
  const ordersByClub = useOrderStore(useShallow((state) => state.ordersByClub));

  useEffect(() => {
    getOrderByClub(club.id);
  }, [getOrderByClub, club]);

  const renderBookingList = (unit: UnitModel) => {
	if (ordersByClub.length === 0) return null;

    const unitBookings = ordersByClub?.find(item => item?.unitId === unit.id)?.orders ?? [];

    if (unitBookings.length === 0) {
      return (
        <View style={[styles.bookingListContainer, styles.emptyContainer]}>
          <CalendarIcon color={theme.textLight} size={30} />
          <Text style={styles.emptyTitle}>No Bookings</Text>
          <Text style={styles.emptyText}>
            There are no bookings for {unit.name} yet
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={unitBookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.bookingListContainer}
        renderItem={({ item }) => <BookingItem booking={item} theme={theme} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    );
  };

  const routes = club.units.map((unit) => ({
    key: unit.id,
    title: unit.name,
    component: renderBookingList(unit),
    icon: () => <CalendarIcon color="#000" size={18} />,
  }));

  return (
    <View style={styles.container}>
      <Header />
      {routes.length > 0 ? (
        <UnitTab routes={routes} />
      ) : (
        <ShadowedView style={styles.emptyCardShadow}>
          <View style={styles.emptyCard}>
            <CalendarIcon color={theme.textLight} size={40} />
            <Text style={styles.emptyTitle}>No Units Available</Text>
            <Text style={styles.emptyText}>
              Add units to your club to start managing bookings
            </Text>
          </View>
        </ShadowedView>
      )}
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundLight,
    },
    bookingListContainer: {
      flex: 1,
      padding: hp(2),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyCardShadow: {
      marginHorizontal: wp(4),
      marginTop: hp(4),
      borderRadius: Radius.md,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    emptyCard: {
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.md,
      padding: hp(4),
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.lg,
      color: theme.textDark,
      marginTop: hp(2),
      marginBottom: hp(1),
    },
    emptyText: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      color: theme.textLight,
      textAlign: 'center',
    },
    separator: {
      height: hp(1),
    },
  });

export default BookingsScreen;
