import React, { FC, useContext, useEffect, useState } from 'react';
import {
  Alert, FlatList, Image, StyleSheet, Switch, Text, TouchableOpacity, View
} from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';

import HeaderWithBack from '@/components/common/HeaderWithBack';
import UnitForm from '@/components/unit/UnitForm';
import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import { mockSportTypes } from '@/mock/club';
import { MainStackParamList } from '@/screens/main';
import { Unit } from '@/types/club';
import Button from '@/ui/button/BaseButton';
import FloatButton from '@/ui/button/FloatButton';
import PlusIcon from '@/ui/icon/Plus';
import { PLACEHOLDER_IMAGE } from '@env';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Mock data for units
const mockUnits: Unit[] = [
  {
    id: '1',
    name: 'Tennis Court A',
    openTime: '08:00',
    closeTime: '22:00',
    phone: '0123456789',
    description: 'Professional tennis court with lighting for night play',
    status: 1,
    address: {
      id: '1',
      address: '123 Sports Street',
      locationGeography: {
        latitude: 10.762622,
        longitude: 106.660172,
      },
      ward: 'Ward 1',
      wardCode: 'W1',
      district: 'District 1',
      districtCode: 'D1',
      province: 'Ho Chi Minh City',
      provinceCode: 'HCM',
    },
    sportTypes: [{ id: '1', name: 'Tennis' }],
    images: [
      {
        id: '1',
        filePath: PLACEHOLDER_IMAGE,
        fileType: 'image/jpeg',
        hash: 'hash1',
      },
    ],
    services: [
      {
        id: '1',
        name: 'Equipment Rental',
        description: 'Rent tennis rackets and balls',
        price: 50000,
        currency: 'VND',
      },
    ],
    prices: [
      {
        id: '1',
        price: 30000,
        currency: 'VND',
        startTime: '08:00',
        endTime: '14:00',
      },
      {
        id: '2',
        price: 50000,
        currency: 'VND',
        startTime: '14:00',
        endTime: '22:00',
      },
    ],
  },
  {
    id: '2',
    name: 'Basketball Court',
    openTime: '09:00',
    closeTime: '21:00',
    phone: '0987654321',
    description: 'Indoor basketball court with air conditioning',
    status: 1,
    address: {
      id: '2',
      address: '456 Sports Avenue',
      locationGeography: {
        latitude: 10.772622,
        longitude: 106.670172,
      },
      ward: 'Ward 2',
      wardCode: 'W2',
      district: 'District 2',
      districtCode: 'D2',
      province: 'Ho Chi Minh City',
      provinceCode: 'HCM',
    },
    sportTypes: [{ id: '2', name: 'Basketball' }],
    images: [
      {
        id: '2',
        filePath: PLACEHOLDER_IMAGE,
        fileType: 'image/jpeg',
        hash: 'hash2',
      },
    ],
    services: [
      {
        id: '2',
        name: 'Coaching',
        description: 'Professional basketball coaching',
        price: 200000,
        currency: 'VND',
      },
    ],
    prices: [
      {
        id: '3',
        price: 40000,
        currency: 'VND',
        startTime: '09:00',
        endTime: '15:00',
      },
      {
        id: '4',
        price: 60000,
        currency: 'VND',
        startTime: '15:00',
        endTime: '21:00',
      },
    ],
  },
];

const UnitManagementScreen: FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  // State for units data
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [isLoading, setIsLoading] = useState(false);

  // State for unit form modal
  const [showUnitForm, setShowUnitForm] = useState(false);
  const [currentUnit, setCurrentUnit] = useState<Unit | undefined>(undefined);

  // Fetch units on component mount
  useEffect(() => {
    fetchUnits();
  }, []);

  // Fetch units from API (mock for now)
  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from an API
      // For now, we'll use mock data
      setTimeout(() => {
        setUnits(mockUnits);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching units:', error);
      Alert.alert('Error', 'Failed to load units');
      setIsLoading(false);
    }
  };

  // Handle add unit
  const handleAddUnit = () => {
    setCurrentUnit(undefined);
    setShowUnitForm(true);
  };

  // Handle edit unit
  const handleEditUnit = (unit: Unit) => {
    setCurrentUnit(unit);
    setShowUnitForm(true);
  };

  // Handle save unit
  const handleSaveUnit = (unit: Unit) => {
    if (currentUnit) {
      // Update existing unit
      setUnits((prevUnits) =>
        prevUnits.map((u) => (u.id === unit.id ? unit : u))
      );
      Alert.alert('Success', 'Unit updated successfully');
    } else {
      // Add new unit
      setUnits((prevUnits) => [...prevUnits, unit]);
      Alert.alert('Success', 'Unit added successfully');
    }
    setShowUnitForm(false);
  };

  // Handle disable/enable unit
  const handleToggleUnitStatus = (unit: Unit) => {
    // In a real app, this would call an API to update the unit status
    Alert.alert(
      'Confirm',
      `Are you sure you want to ${unit.status === 1 ? 'disable' : 'enable'} this unit?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            const updatedUnit = {
              ...unit,
              status: unit.status === 1 ? 0 : 1,
            };
            setUnits((prevUnits) =>
              prevUnits.map((u) => (u.id === unit.id ? updatedUnit : u))
            );
          },
        },
      ]
    );
  };

  // Render unit item
  const renderUnitItem = ({ item }: { item: Unit }) => {
    return (
      <ShadowedView style={styles.unitCard}>
        <View style={styles.unitHeader}>
          <View style={styles.unitTitleRow}>
            <Image
              source={{
                uri:
                  item.images.length > 0
                    ? item.images[0].filePath
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
              onPress={() => handleEditUnit(item)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <Switch
              value={item.status === 1}
              onValueChange={() => handleToggleUnitStatus(item)}
              trackColor={{ false: theme.disable, true: theme.primary }}
              thumbColor={theme.white}
            />
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
            Services: {item.services.length} | Prices: {item.prices.length}
          </Text>
          <Text style={styles.unitAddress} numberOfLines={2}>
            Address: {item.address.address}, {item.address.ward},{' '}
            {item.address.district}, {item.address.province}
          </Text>
        </View>
      </ShadowedView>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderWithBack title="Unit Management" isClose={false} />

      <View style={styles.content}>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading units...</Text>
        ) : units.length > 0 ? (
          <FlatList
            data={units}
            renderItem={renderUnitItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.unitList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No units found</Text>
            <Button
              title="Add Unit"
              onPress={handleAddUnit}
              buttonStyle={styles.addUnitButton}
            />
          </View>
        )}
      </View>

      {/* Floating Add Button */}
      {units.length > 0 && (
        <FloatButton
          icon={<PlusIcon color={theme.white} />}
          onPress={handleAddUnit}
        />
      )}

      {/* Unit Form Modal */}
      <UnitForm
        visible={showUnitForm}
        onClose={() => setShowUnitForm(false)}
        unit={currentUnit}
        sportTypes={mockSportTypes}
        onSave={handleSaveUnit}
        theme={theme}
      />
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
