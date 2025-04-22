import React, { FC, useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme, Radius, UNIT_ORDER_BY, UNIT_ORDER_TYPE
} from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import i18n from '@/helpers/i18n';
import { logError } from '@/helpers/logger';
import { District, Province, Ward } from '@/services/types';
import Button from '@/ui/button/BaseButton';
import Dropdown from '@/ui/dropdown/Dropdown';
import CategoryIcon from '@/ui/icon/Category';
import CloseIcon from '@/ui/icon/Close';
import LocationIcon from '@/ui/icon/Location';
import SortIcon from '@/ui/icon/Sort';
import TagIcon from '@/ui/icon/Tag';
import { useLocationStore, useUnitStore } from '@/zustand';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
}

// Mock data - replace with your actual data
const SPORT_TYPES = ['Badminton', 'Tennis', 'Football', 'Basketball'];

const FilterModal: FC<FilterModalProps> = ({ visible, onClose, onApply }) => {
  const insets = useSafeAreaInsets();
  const { theme } = React.useContext(ThemeContext);
  const styles = createStyles(theme, insets);

  const getProvince = useLocationStore((state) => state.getProvince);
  const getDistrict = useLocationStore((state) => state.getDistrict);
  const getWard = useLocationStore((state) => state.getWard);
  const filter = useUnitStore((state) => state.filter);
  const updateFilter = useUnitStore((state) => state.updateFilter);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const handleProvinceChange = async (province: string) => {
    updateFilter({
      ...filter,
      location: { ...filter.location, province, district: '', ward: '' },
      isNearby: false,
    });

    try {
      const rawDistricts = await getDistrict(province);
      setDistricts(rawDistricts);
    } catch (error) {
      if (error instanceof Error) {
        logError(error, 'Error fetching districts:');
      }
    }
  };

  const handleDistrictChange = async (district: string) => {
    updateFilter({
      ...filter,
      location: { ...filter.location, district, ward: '' },
    });

    try {
      const rawWards = await getWard(district);
      setWards(rawWards);
    } catch (error) {
      if (error instanceof Error) {
        logError(error, 'Error fetching wards:');
      }
    }
  };

  const handleWardChange = (ward: string) => {
    updateFilter({
      ...filter,
      location: { ...filter.location, ward },
    });
  };

  const handleSportTypeChange = (sportType: string) => {
    updateFilter({ ...filter, sportType });
  };

  const toggleNearby = () => {
    const newNearbyState = !filter.isNearby;

    updateFilter({
      ...filter,
      isNearby: newNearbyState,
      location: newNearbyState
        ? { province: '', district: '', ward: '' }
        : filter.location,
    });
  };

  const hasLocationSelected = !!filter.location.province;

  const handleOrderByChange = (orderBy: string) => {
    updateFilter({ ...filter, orderBy });
  };

  const handleOrderTypeChange = (orderType: string) => {
    updateFilter({ ...filter, orderType });
  };

  const handleApply = () => {
    onApply();
    onClose();
  };

  const handleReset = () => {
    updateFilter({
      location: { province: '', district: '', ward: '' },
      sportType: '',
      isNearby: false,
      orderBy: '',
      orderType: '',
      query: filter.query,
    });
  };

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const rawProvinces = await getProvince();
        setProvinces(rawProvinces);
      } catch (error) {
        if (error instanceof Error) {
          logError(error, 'Error fetching provinces:');
        }
      }
    };
    loadProvinces();
  }, [getProvince, setProvinces]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{i18n.t('filter.title')}</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <CloseIcon size={DEFAULT_ICON_SIZE} color={theme.textDark} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Section 1: Tags */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TagIcon size={DEFAULT_ICON_SIZE - 4} color={theme.primary} />
                <Text style={styles.sectionTitle}>Tags</Text>
              </View>
              <View style={styles.sectionContent}>
                <Pressable
                  style={[
                    styles.tagButton,
                    filter.isNearby && styles.activeTagButton,
                    hasLocationSelected && styles.disabledTagButton,
                  ]}
                  onPress={toggleNearby}
                  disabled={hasLocationSelected}
                >
                  <Text
                    style={[
                      styles.tagText,
                      filter.isNearby && styles.activeTagText,
                      hasLocationSelected && styles.disabledTagText,
                    ]}
                  >
                    Nearby
                  </Text>
                </Pressable>
                {hasLocationSelected && (
                  <Text style={styles.disabledTagNote}>
                    (Disabled when location is selected)
                  </Text>
                )}
              </View>
            </View>

            {/* Section 2: Location */}
            <View
              style={[
                styles.section,
                filter.isNearby && styles.disabledSection,
              ]}
            >
              <View style={styles.sectionHeader}>
                <LocationIcon
                  size={DEFAULT_ICON_SIZE - 4}
                  color={filter.isNearby ? theme.textLight : theme.primary}
                />
                <Text
                  style={[
                    styles.sectionTitle,
                    filter.isNearby && styles.disabledText,
                  ]}
                >
                  Location
                </Text>
                {filter.isNearby && (
                  <Text style={styles.disabledNote}>
                    (Disabled when Nearby is selected)
                  </Text>
                )}
              </View>
              <View style={styles.sectionContent}>
                <Dropdown
                  value={filter.location.province}
                  items={provinces.map((item: Province) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  onSelect={handleProvinceChange}
                  placeholder={i18n.t('filter.dropdown.province')}
                  containerStyle={styles.dropdown}
                  disabled={filter.isNearby}
                />
                <Dropdown
                  value={filter.location.district}
                  items={districts.map((item: District) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  onSelect={handleDistrictChange}
                  placeholder={i18n.t('filter.dropdown.district')}
                  containerStyle={styles.dropdown}
                  disabled={!filter.location.province || filter.isNearby}
                />
                <Dropdown
                  value={filter.location.ward}
                  items={wards.map((item: Ward) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  onSelect={handleWardChange}
                  placeholder={i18n.t('filter.dropdown.ward')}
                  containerStyle={styles.dropdown}
                  disabled={!filter.location.district || filter.isNearby}
                />
              </View>
            </View>

            {/* Section 3: Sport Type */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <CategoryIcon
                  size={DEFAULT_ICON_SIZE - 4}
                  color={theme.primary}
                />
                <Text style={styles.sectionTitle}>Sport Type</Text>
              </View>
              <View style={styles.sectionContent}>
                <Dropdown
                  value={filter.sportType}
                  items={SPORT_TYPES.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  onSelect={handleSportTypeChange}
                  placeholder={i18n.t('filter.dropdown.sport_type')}
                  containerStyle={styles.dropdown}
                />
              </View>
            </View>

            {/* Section 4: Sort */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <SortIcon size={DEFAULT_ICON_SIZE - 4} color={theme.primary} />
                <Text style={styles.sectionTitle}>Sort</Text>
              </View>
              <View style={styles.sectionContent}>
                <Dropdown
                  value={filter.orderBy}
                  items={UNIT_ORDER_BY.map((item) => ({
                    label: item.name,
                    value: item.value,
                  }))}
                  onSelect={handleOrderByChange}
                  placeholder={i18n.t('filter.dropdown.order_by')}
                  containerStyle={styles.dropdown}
                />
                <Dropdown
                  value={filter.orderType}
                  items={UNIT_ORDER_TYPE.map((item) => ({
                    label: item.name,
                    value: item.value,
                  }))}
                  onSelect={handleOrderTypeChange}
                  placeholder={i18n.t('filter.dropdown.order_type')}
                  containerStyle={styles.dropdown}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title={i18n.t('filter.reset')}
              onPress={handleReset}
              buttonStyle={styles.resetButton}
            />
            <Button
              title={i18n.t('filter.apply')}
              onPress={handleApply}
              buttonStyle={styles.applyButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: IColorScheme, insets: any) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: theme.overlay,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.backgroundLight,
      borderTopLeftRadius: Radius.xl,
      borderTopRightRadius: Radius.xl,
      paddingBottom: insets.bottom > 0 ? insets.bottom : hp(2),
      maxHeight: '90%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: wp(4),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    title: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.lg,
      color: theme.textDark,
    },
    scrollView: {
      maxHeight: hp(70),
    },
    section: {
      padding: wp(4),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp(2),
    },
    sectionTitle: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.md,
      color: theme.textDark,
      marginLeft: wp(2),
    },
    sectionContent: {
      gap: hp(1.5),
    },
    dropdown: {
      marginBottom: hp(1.5),
    },
    tagButton: {
      borderWidth: 1,
      borderColor: theme.borderDark,
      borderRadius: Radius.md,
      paddingHorizontal: wp(4),
      paddingVertical: hp(1),
      alignSelf: 'flex-start',
    },
    activeTagButton: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    tagText: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      color: theme.textDark,
    },
    activeTagText: {
      color: theme.white,
    },
    footer: {
      flexDirection: 'row',
      padding: wp(3),
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
    },
    resetButton: {
      width: hp(12),
    },
    applyButton: {
      width: hp(12),
    },
    disabledSection: {
      opacity: 0.7,
    },
    disabledText: {
      color: theme.textLight,
    },
    disabledNote: {
      ...fontFamily.POPPINS_ITALIC,
      fontSize: fontSize.xs,
      color: theme.textLight,
      marginLeft: wp(2),
    },
    disabledTagButton: {
      borderColor: theme.borderLight,
      backgroundColor: theme.backgroundDark,
    },
    disabledTagText: {
      color: theme.textLight,
    },
    disabledTagNote: {
      ...fontFamily.POPPINS_ITALIC,
      fontSize: fontSize.xs,
      color: theme.textLight,
      marginTop: hp(0.5),
    },
  });

export default FilterModal;
