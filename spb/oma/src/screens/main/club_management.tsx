import React, { FC, useContext, useState } from 'react';
import {
  FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';
import { launchImageLibrary } from 'react-native-image-picker';
import { useShallow } from 'zustand/shallow';

import HeaderWithBack from '@/components/common/HeaderWithBack';
import MapView from '@/components/common/MapView';
import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import { logError } from '@/helpers/logger';
import { toastError, toastSuccess } from '@/helpers/toast';
import { MainStackParamList } from '@/screens/main';
import mediaService, { RNImageFile } from '@/services/media.service';
import { ClubModel, ClubUpdateModel, MediaModel, SportTypeModel } from '@/types/model';
import Button from '@/ui/button/BaseButton';
import Dropdown from '@/ui/dropdown/Dropdown';
import { useAuthStore, useClubStore, useLocationStore, useSportTypeStore } from '@/zustand';
import { PLACEHOLDER_IMAGE } from '@env';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const ClubManagementScreen: FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const sportType = useSportTypeStore(useShallow((state) => state.sportType));
  const clubModel = useClubStore(useShallow((state) => state.club));
  const userId = useAuthStore(useShallow((state) => state.userId));
  const getDistrict = useLocationStore((state) => state.getDistrict);
  const getWard = useLocationStore((state) => state.getWard);
  const provinces = useLocationStore((state) => state.province);
  const districts = useLocationStore((state) => state.district);
  const wards = useLocationStore((state) => state.ward);

  const fetchClubByOwner = useClubStore((state) => state.fetchClubByOwner);
  const updateClub = useClubStore((state) => state.updateClub);
  const addMediaToClub = useClubStore((state) => state.addMediaToClub);
  const removeMediaFromClub = useClubStore(
    (state) => state.removeMediaFromClub
  );

  // State for club data
  const [club, setClub] = useState<ClubModel>(clubModel);
  const [updatedClub, setUpdatedClub] = useState<ClubUpdateModel>({
    sportTypes: clubModel.sportTypes.map((st) => st.id),
  });
  const [selectedSportTypes, setSelectedSportTypes] = useState<
    SportTypeModel[]
  >(club.sportTypes);

  // Address selection state
  const [selectedProvince, setSelectedProvince] = useState<string>(
    club.address.provinceId
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    club.address.districtId
  );
  const [selectedWard, setSelectedWard] = useState<string>(club.address.wardId);

  const [scrollEnabled, setScrollEnabled] = useState(true);

  const handleMapTouchStart = () => {
    setScrollEnabled(false);
  };

  const handleOutsideMapTouch = () => {
    setScrollEnabled(true);
  };

  // Handle province selection
  const handleProvinceSelect = (provinceId: string) => {
    const province = provinces.find((p) => p.id === provinceId);

    setSelectedProvince(provinceId);
    setSelectedDistrict('');
    setSelectedWard('');

    // Update club address with province info
    setClub((prevClub) => ({
      ...prevClub,
      address: {
        ...prevClub.address,
        province: province?.name || '',
        provinceId: provinceId,
        district: '',
        districtCode: '',
        ward: '',
        wardCode: '',
      },
    }));

    // Update updatedClub for API
    setUpdatedClub((prevClub) => ({
      ...prevClub,
      address: {
        ...prevClub.address,
        wardId: '',
      },
    }));

    // Fetch districts for the selected province
    getDistrict(provinceId);
  };

  // Handle district selection
  const handleDistrictSelect = (districtId: string) => {
    const district = districts.find((d) => d.id === districtId);

    setSelectedDistrict(districtId);
    setSelectedWard('');

    // Update club address with district info
    setClub((prevClub) => ({
      ...prevClub,
      address: {
        ...prevClub.address,
        district: district?.name || '',
        districtCode: districtId,
        ward: '',
        wardCode: '',
      },
    }));

    // Fetch wards for the selected district
    getWard(districtId);
  };

  // Handle ward selection
  const handleWardSelect = (wardId: string) => {
    const ward = wards.find((w) => w.id === wardId);

    setSelectedWard(wardId);

    // Update club address with ward info
    setClub((prevClub) => ({
      ...prevClub,
      address: {
        ...prevClub.address,
        ward: ward?.name || '',
        wardCode: wardId,
      },
    }));

    // Update updatedClub for API
    setUpdatedClub((prevClub) => ({
      ...prevClub,
      address: {
        ...prevClub.address,
        wardId: wardId,
      },
    }));
  };

  // Handle club field updates
  const handleUpdateClubField = (field: keyof ClubModel, value: string) => {
    setClub((prevClub) => ({
      ...prevClub,
      [field]: value,
    }));
    setUpdatedClub((prevClub) => ({
      ...prevClub,
      [field]: value,
    }));
  };

  // Toggle sport type selection
  const toggleSportType = (sportType: SportTypeModel) => {
    const isSelected = selectedSportTypes.some((st) => st.id === sportType.id);

    if (isSelected) {
      setSelectedSportTypes(
        selectedSportTypes.filter((st) => st.id !== sportType.id)
      );
    } else {
      setSelectedSportTypes([...selectedSportTypes, sportType]);
    }

    // Update club with selected sport types
    setClub((prevClub) => ({
      ...prevClub,
      sportTypes: isSelected
        ? prevClub.sportTypes.filter((st) => st.id !== sportType.id)
        : [...prevClub.sportTypes, sportType],
    }));
    setUpdatedClub((prevClub) => {
      let preSportType: string[] = [];
      if (prevClub.sportTypes && prevClub.sportTypes.length > 0) {
        preSportType = prevClub?.sportTypes;
      }
      return {
        ...prevClub,
        sportTypes: isSelected
          ? preSportType.filter((st) => st !== sportType.id)
          : [...preSportType, sportType.id],
      };
    });
  };

  const handleLocationChange = (feature: GeoJSON.Feature) => {
    if (feature.geometry.type === 'Point') {
      const coords = (feature.geometry as GeoJSON.Point).coordinates;
      setClub((prevClub) => ({
        ...prevClub,
        address: {
          ...prevClub.address,
          locationGeography: {
            latitude: coords[1],
            longitude: coords[0],
          },
        },
      }));
      setUpdatedClub((prevClub) => ({
        ...prevClub,
        address: {
          ...prevClub.address,
          locationGeography: {
            latitude: coords[1],
            longitude: coords[0],
          },
        },
      }));
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    // Ensure address information is properly included
    const finalUpdatedClub: ClubUpdateModel = {
      ...updatedClub,
      address: {
        ...updatedClub.address,
        address: club.address.address,
        wardId: selectedWard || undefined,
        locationGeography: club.address.locationGeography,
      },
    };

    try {
      await updateClub(finalUpdatedClub, club.id);
      // Show success message
      toastSuccess('Club information saved successfully');
    } catch (error) {
      logError(error as Error);
      toastError('Failed to save club information');
    }
    fetchClubByOwner(userId);
  };

  // Render club image item
  const renderImageItem = ({ item }: { item: MediaModel }) => {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.filePath }}
          style={styles.image}
          resizeMode="cover"
        />
        {club.media.length <= 1 ? null : (
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={async () => await handleRemoveImage(item.mediaId)}
          >
            <Text style={styles.removeImageText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const handleAddImage = async () => {
    try {
      // Launch image picker
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.didCancel || !result.assets || result.assets.length === 0) {
        return;
      }

      const selectedImage = result.assets[0];

      // Create file object from URI with all required properties
      const fileToUpload: RNImageFile = {
        uri: selectedImage.uri || PLACEHOLDER_IMAGE,
        type: selectedImage.type || 'image/jpeg',
        name: selectedImage.fileName || `image_${Date.now()}.jpg`,
      };

      // Upload image
      const response = await mediaService.upload(fileToUpload);

      if (response instanceof Error) {
        throw response;
      }

      // Add uploaded image to club media
      const newMedia = response.data;
      const mediaId = await addMediaToClub(club.id, newMedia);

      setClub((prevClub) => ({
        ...prevClub,
        media: [...prevClub.media, { ...newMedia, mediaId }],
      }));
    } catch (error) {
      console.error('Image upload error:', error);
      logError(error as Error);

      // Show more detailed error message
      if (error instanceof Error) {
        toastError(`Failed to upload image: ${error.message}`);
      } else {
        toastError('Failed to upload image');
      }
    }
  };

  const handleRemoveImage = async (mediaId: string) => {
    try {
      await removeMediaFromClub(mediaId);
      setClub((prevClub) => ({
        ...prevClub,
        media: prevClub.media.filter((img) => img.mediaId !== mediaId),
      }));
    } catch (error) {
      logError(error as Error);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderWithBack title="Manage Club" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={scrollEnabled}
      >
        {/* Club Information Section */}
        <ShadowedView
          style={styles.section}
          onTouchStart={handleOutsideMapTouch}
        >
          <Text style={styles.sectionTitle}>Club Information</Text>

          <View style={styles.formField}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={club.name}
              onChangeText={(text) => handleUpdateClubField('name', text)}
              placeholder="Club name"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={club.phone}
              onChangeText={(text) => handleUpdateClubField('phone', text)}
              placeholder="Phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={club.address.address}
              onChangeText={(text) => {
                setClub({
                  ...club,
                  address: { ...club.address, address: text },
                });
                setUpdatedClub({
                  ...updatedClub,
                  address: {
                    ...updatedClub.address,
                    address: text,
                  },
                });
              }}
              placeholder="Address"
            />
          </View>

          {/* Province Dropdown */}
          <View style={styles.formField}>
            <Text style={styles.label}>Province</Text>
            <Dropdown
              value={selectedProvince}
              items={provinces.map((province) => ({
                label: province.name,
                value: province.id,
              }))}
              onSelect={handleProvinceSelect}
              placeholder="Select Province"
              containerStyle={styles.dropdown}
            />
          </View>

          {/* District Dropdown */}
          <View style={styles.formField}>
            <Text style={styles.label}>District</Text>
            <Dropdown
              value={selectedDistrict}
              items={districts.map((district) => ({
                label: district.name,
                value: district.id,
              }))}
              onSelect={handleDistrictSelect}
              placeholder="Select District"
              containerStyle={styles.dropdown}
              disabled={!selectedProvince}
            />
          </View>

          {/* Ward Dropdown */}
          <View style={styles.formField}>
            <Text style={styles.label}>Ward</Text>
            <Dropdown
              value={selectedWard}
              items={wards.map((ward) => ({
                label: ward.name,
                value: ward.id,
              }))}
              onSelect={handleWardSelect}
              placeholder="Select Ward"
              containerStyle={styles.dropdown}
              disabled={!selectedDistrict}
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={club.description}
              onChangeText={(text) =>
                handleUpdateClubField('description', text)
              }
              placeholder="Description"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </ShadowedView>
        <MapView
          scrollEnabled={true}
          onMapTouchStart={handleMapTouchStart}
          coordinates={club.address.locationGeography}
          onMapPress={handleLocationChange}
        />

        {/* Sport Types Section */}
        <View style={styles.section} onTouchStart={handleOutsideMapTouch}>
          <Text style={styles.sectionTitle}>Sport Types</Text>
          <Text style={styles.sectionDescription}>
            Select all sport types available at this club
          </Text>

          <View style={styles.sportTypeContainer}>
            {sportType.map((item) => {
              const isSelected = selectedSportTypes.some(
                (st) => st.id === item.id
              );
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.sportTypeItem,
                    isSelected && styles.sportTypeItemSelected,
                  ]}
                  onPress={() => toggleSportType(item)}
                >
                  <Text
                    style={[
                      styles.sportTypeText,
                      isSelected && styles.sportTypeTextSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Images Section */}
        <View style={styles.section} onTouchStart={handleOutsideMapTouch}>
          <Text style={styles.sectionTitle}>Images</Text>

          <FlatList
            data={club.media}
            renderItem={renderImageItem}
            keyExtractor={(item) => item.mediaId}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageList}
            ListFooterComponent={
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={handleAddImage}
              >
                <Text style={styles.addImageText}>+</Text>
              </TouchableOpacity>
            }
          />
        </View>

        {/* Units Section */}
        <View style={styles.section} onTouchStart={handleOutsideMapTouch}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Units</Text>
            <View style={styles.unitButtonsContainer}>
              <TouchableOpacity
                style={styles.manageButton}
                onPress={() =>
                  navigation.navigate('UnitManagement')
                }
              >
                <Text style={styles.manageButtonText}>Manage Units</Text>
              </TouchableOpacity>
            </View>
          </View>

          {club.units.length > 0 ? (
            club.units.map((item) => (
              <View key={item.id} style={styles.unitCard}>
                <View style={styles.unitHeader}>
                  <Text style={styles.unitName}>{item.name}</Text>
                </View>
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
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No units added yet</Text>
          )}
        </View>

        {/* Save Button */}
        <Button
          title="Save Changes"
          onPress={handleSaveChanges}
          buttonStyle={styles.saveButton}
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
      paddingBottom: hp(4),
    },
    section: {
      backgroundColor: theme.white,
      borderRadius: Radius.md,
      marginHorizontal: wp(4),
      marginTop: hp(2),
      padding: hp(2),
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    sectionTitle: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.lg,
      color: theme.textDark,
      marginBottom: hp(1),
    },
    sectionDescription: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textLight,
      marginBottom: hp(1),
    },
    sportTypeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: hp(1),
    },
    sportTypeItem: {
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.full,
      paddingVertical: hp(0.8),
      paddingHorizontal: wp(3),
      margin: wp(1),
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(1),
    },
    formField: {
      marginBottom: hp(2),
    },
    label: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.textDark,
      marginBottom: hp(0.5),
    },
    input: {
      height: hp(6),
      borderWidth: 1,
      borderColor: theme.borderLight,
      borderRadius: Radius.xs,
      paddingHorizontal: wp(3),
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      color: theme.textDark,
      backgroundColor: theme.white,
    },
    textArea: {
      height: hp(12),
      paddingTop: hp(1),
      textAlignVertical: 'top',
    },
    sportTypeList: {
      flexDirection: 'row',
      marginTop: hp(1),
    },
    sportTypeItemSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    sportTypeText: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textDark,
    },
    sportTypeTextSelected: {
      color: theme.white,
    },
    imageList: {
      paddingVertical: hp(1),
    },
    imageContainer: {
      marginRight: wp(2),
      position: 'relative',
    },
    image: {
      width: wp(25),
      height: wp(25),
      borderRadius: Radius.xs,
    },
    removeImageButton: {
      position: 'absolute',
      top: -hp(1),
      right: -hp(1),
      backgroundColor: theme.error,
      width: hp(2.5),
      height: hp(2.5),
      borderRadius: Radius.full,
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeImageText: {
      color: theme.white,
      fontSize: fontSize.xs,
      fontWeight: 'bold',
    },
    addImageButton: {
      width: wp(25),
      height: wp(25),
      borderRadius: Radius.xs,
      borderWidth: 1,
      borderColor: theme.borderLight,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundLight,
    },
    addImageText: {
      fontSize: fontSize.xl,
      color: theme.textLight,
    },
    unitCard: {
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.xs,
      padding: hp(2),
      marginBottom: hp(1.5),
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    unitHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(1),
    },
    unitName: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.md,
      color: theme.textDark,
    },
    unitDetail: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textDark,
      marginBottom: hp(0.5),
    },
    unitButtonsContainer: {
      flexDirection: 'row',
    },
    manageButton: {
      backgroundColor: theme.primary,
      paddingVertical: hp(0.8),
      paddingHorizontal: wp(3),
      borderRadius: Radius.xs,
      marginRight: wp(2),
    },
    manageButtonText: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.white,
    },
    emptyText: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      color: theme.textLight,
      textAlign: 'center',
      marginVertical: hp(2),
    },
    saveButton: {
      marginHorizontal: wp(4),
      marginTop: hp(3),
    },
    dropdown: {
      marginBottom: hp(1),
    },
  });

export default ClubManagementScreen;
