import { debounce } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useShallow } from 'zustand/shallow';

import {
  DEFAULT_ICON_SIZE, fontFamily, fontSize, GEOGRAPHY_RADIUS, IColorScheme, Radius, UNIT_ORDER_BY,
  UNIT_ORDER_TYPE
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
import BaseModal from '@/ui/modal/BaseModal';
import { useLocationStore, useSportTypeStore, useUnitStore } from '@/zustand';
import Slider from '@react-native-community/slider';

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
}

const FilterModal: FC<Props> = ({ visible, onClose, onApply }) => {
  const { theme } = React.useContext(ThemeContext);
  const styles = createStyles(theme);

  const getProvince = useLocationStore((state) => state.getProvince);
  const getDistrict = useLocationStore((state) => state.getDistrict);
  const getWard = useLocationStore((state) => state.getWard);
  const updateFilter = useUnitStore((state) => state.updateFilter);

  const filter = useUnitStore(useShallow((state) => state.filter));
  const sportType = useSportTypeStore((state) => state.sportType);

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

  const handleRadiusChange = debounce((value: number) => {
    updateFilter({ radius: Math.round(value) });
  }, 500);

  const handleApply = () => {
    onApply();
    onClose();
  };

  const handleReset = () => {
    updateFilter({
      location: { province: '', district: '', ward: '' },
      sportType: '',
      isNearby: false,
      radius: GEOGRAPHY_RADIUS,
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
    <BaseModal onClose={onClose} visible={visible}>
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

              {/* Nearby Radius Subsection */}
              {filter.isNearby && (
                <View style={styles.radiusContainer}>
                  <Text style={styles.radiusLabel}>
                    Radius: {Math.round(filter.radius / 1000)}km
                  </Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={GEOGRAPHY_RADIUS}
                    step={1000}
                    value={filter.radius}
                    onValueChange={handleRadiusChange}
                    minimumTrackTintColor={theme.primary}
                    maximumTrackTintColor={theme.borderLight}
                    thumbTintColor={theme.primary}
                  />
                  <View style={styles.sliderLabels}>
                    <Text style={styles.sliderLabel}>1km</Text>
                    <Text style={styles.sliderLabel}>
                      {Math.round(GEOGRAPHY_RADIUS / 1000)}km
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Section 2: Location */}
          <View
            style={[styles.section, filter.isNearby && styles.disabledSection]}
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
                searchable={false}
                value={filter.sportType}
                items={sportType.map((item) => ({
                  label: item.name,
                  value: item.id,
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
                searchable={false}
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
                searchable={false}
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
    </BaseModal>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    modalContent: {
      backgroundColor: theme.backgroundLight,
      borderTopLeftRadius: Radius.xl,
      borderTopRightRadius: Radius.xl,
      maxHeight: '90%',
      width: '100%',
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
      borderColor: theme.borderLight,
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
    radiusContainer: {
      marginTop: hp(2),
      paddingTop: hp(1.5),
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
      width: '100%',
    },
    radiusLabel: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.textDark,
      marginBottom: hp(1),
    },
    slider: {
      width: '100%',
      height: hp(4),
    },
    sliderLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: wp(1),
    },
    sliderLabel: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textLight,
    },
  });

export default FilterModal;
