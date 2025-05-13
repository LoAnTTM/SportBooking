import React, { FC, useContext, useEffect } from 'react';
import {
  Alert, FlatList, Image, StyleSheet, Switch, Text, TouchableOpacity, View
} from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';
import { useShallow } from 'zustand/shallow';

import HeaderWithBack from '@/components/common/HeaderWithBack';
import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import { MainStackParamList } from '@/screens/main';
import { UnitModel } from '@/types/model';
import FloatButton from '@/ui/button/FloatButton';
import PlusIcon from '@/ui/icon/Plus';
import { useAuthStore, useClubStore } from '@/zustand';
import { PLACEHOLDER_IMAGE } from '@env';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const UnitManagementScreen: FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  // State for club.units data
  const club = useClubStore(useShallow((state) => state.club));
  const userId = useAuthStore(useShallow((state) => state.userId));
  const fetchClubByOwner = useClubStore((state) => state.fetchClubByOwner);
  const isLoading = useClubStore(useShallow((state) => state.isLoading));

  useEffect(() => {
    fetchClubByOwner(userId);
  }, []);

  // Handle add unit
  const handleAddUnit = () => {
    // Navigate to UnitForm screen with empty unit
    navigation.navigate('UnitForm', { unitId: undefined });
  };

  // Handle edit unit
  const handleEditUnit = (unitId: string) => {
    // Navigate to UnitForm screen with selected unitId
    navigation.navigate('UnitForm', { unitId });
  };

  // Render unit item
  const renderUnitItem = ({ item }: { item: UnitModel }) => {
    return (
      <ShadowedView style={styles.unitCard}>
        <View style={styles.unitHeader}>
          <View style={styles.unitTitleRow}>
            <Image
              source={{
                uri:
                  item.media.length > 0
                    ? item.media[0].filePath
                    : PLACEHOLDER_IMAGE,
              }}
              style={styles.unitImage}
            />
            <View style={styles.unitTitleContainer}>
              <Text style={styles.unitName}>{item.name}</Text>
              <Text style={styles.unitStatus}>
                {item.status === 1 ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          <View style={styles.unitActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditUnit(item.id)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.unitDetails}>
          <Text style={styles.unitDetail}>
            Open: {item.openTime} - {item.closeTime}
          </Text>
          <Text style={styles.unitDetail}>Phone: {item.phone}</Text>
          <Text style={styles.unitDetail}>
            Sport Types: {item.sportTypes.map((st) => st.name).join(', ')}
          </Text>
          <Text style={styles.unitDetail}>
            Services: {item.unitServices.length} | Prices:{' '}
            {item.unitPrices.length}
          </Text>
          <Text style={styles.unitAddress} numberOfLines={2}>
            Address: {item.address.address}
          </Text>
        </View>
      </ShadowedView>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderWithBack title="Unit Management" isClose={false} />
      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <View style={styles.content}>
          {club.units.length > 0 && (
            <FlatList
              data={club.units}
              renderItem={renderUnitItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.unitList}
			  showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}
      {club.units.length > 0 && (
        <FloatButton
          icon={<PlusIcon color={theme.white} />}
          onPress={handleAddUnit}
        />
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
    content: {
      flex: 1,
      padding: wp(4),
    },
    unitList: {
      paddingBottom: hp(2),
    },
    unitCard: {
      backgroundColor: theme.white,
      borderRadius: Radius.md,
      padding: wp(4),
      marginBottom: hp(2),
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 3,
        height: 5,
      },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    unitHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: hp(1.5),
    },
    unitTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    unitImage: {
      width: wp(12),
      height: wp(12),
      borderRadius: Radius.xs,
      marginRight: wp(3),
    },
    unitTitleContainer: {
      flex: 1,
    },
    unitName: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.lg,
      color: theme.textDark,
    },
    unitStatus: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.xs,
      color: theme.primary,
      marginTop: hp(0.2),
    },
    unitActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    editButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: wp(3),
      paddingVertical: hp(0.5),
      borderRadius: Radius.xs,
      marginRight: wp(3),
    },
    editButtonText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.xs,
      color: theme.white,
    },
    unitDetails: {
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
      paddingTop: hp(1.5),
    },
    unitDetail: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      color: theme.textLight,
      marginBottom: hp(0.5),
    },
    unitAddress: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      color: theme.textLight,
      marginTop: hp(0.5),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.md,
      color: theme.textLight,
      marginBottom: hp(2),
    },
    loadingText: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.md,
      color: theme.textLight,
      textAlign: 'center',
      marginTop: hp(10),
    },
    addUnitButton: {
      width: wp(40),
    },
  });

export default UnitManagementScreen;
