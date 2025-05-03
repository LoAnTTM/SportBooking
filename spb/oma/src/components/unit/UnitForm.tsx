import React, { FC, useState } from 'react';
import {
  FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';

import { DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { hp, wp } from '@/helpers/dimensions';
import { Unit, UnitPrice, UnitService } from '@/types/club';
import { MediaModel, SportTypeModel } from '@/types/model';
import Button from '@/ui/button/BaseButton';
import IconButton from '@/ui/button/IconButton';
import CloseIcon from '@/ui/icon/Close';
import BaseModal from '@/ui/modal/BaseModal';
import { PLACEHOLDER_IMAGE } from '@env';

interface UnitFormProps {
  visible: boolean;
  onClose: () => void;
  unit?: Unit;
  sportTypes: SportTypeModel[];
  onSave: (unit: Unit) => void;
  theme: IColorScheme;
}

const UnitForm: FC<UnitFormProps> = ({
  visible,
  onClose,
  unit,
  sportTypes,
  onSave,
  theme,
}) => {
  const styles = createStyles(theme);

  // State for unit data
  const [unitData, setUnitData] = useState<Unit>(
    unit || {
      id: Date.now().toString(),
      name: '',
      openTime: '08:00',
      closeTime: '22:00',
      phone: '',
      description: '',
      status: 1,
      address: {
        id: Date.now().toString(),
        address: '',
        locationGeography: {
          latitude: 0,
          longitude: 0,
        },
        ward: '',
        wardCode: '',
        district: '',
        districtCode: '',
        province: '',
        provinceCode: '',
      },
      sportTypes: [],
      images: [],
      services: [],
      prices: [],
    }
  );

  // State for price form
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<UnitPrice>({
    id: '',
    price: 0,
    currency: 'VND',
    startTime: '',
    endTime: '',
  });

  // State for service form
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [currentService, setCurrentService] = useState<UnitService>({
    id: '',
    name: '',
    description: '',
    price: 0,
    currency: 'VND',
  });

  // Handle update unit field
  const handleUpdateUnitField = (field: keyof Unit, value: any) => {
    setUnitData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Handle update address field
  const handleUpdateAddressField = (field: string, value: string) => {
    setUnitData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [field]: value,
      },
    }));
  };

  // Handle toggle sport type
  const handleToggleSportType = (sportType: SportTypeModel) => {
    const isSelected = unitData.sportTypes.some((st) => st.id === sportType.id);

    if (isSelected) {
      // Remove sport type
      setUnitData((prevData) => ({
        ...prevData,
        sportTypes: prevData.sportTypes.filter((st) => st.id !== sportType.id),
      }));
    } else {
      // Add sport type
      setUnitData((prevData) => ({
        ...prevData,
        sportTypes: [...prevData.sportTypes, sportType],
      }));
    }
  };

  // Handle add price
  const handleAddPrice = () => {
    if (currentPrice.id) {
      // Update existing price
      setUnitData({
        ...unitData,
        prices: unitData.prices.map((p) =>
          p.id === currentPrice.id ? currentPrice : p
        ),
      });
    } else {
      // Add new price
      const newPrice = {
        ...currentPrice,
        id: Date.now().toString(),
      };
      setUnitData({
        ...unitData,
        prices: [...unitData.prices, newPrice],
      });
    }

    // Reset form
    setCurrentPrice({
      id: '',
      price: 0,
      currency: 'VND',
      startTime: '',
      endTime: '',
    });
    setShowPriceForm(false);
  };

  // Handle edit price
  const handleEditPrice = (price: UnitPrice) => {
    setCurrentPrice(price);
    setShowPriceForm(true);
  };

  // Handle delete price
  const handleDeletePrice = (id: string) => {
    setUnitData({
      ...unitData,
      prices: unitData.prices.filter((p) => p.id !== id),
    });
  };

  // Handle add service
  const handleAddService = () => {
    if (currentService.id) {
      // Update existing service
      setUnitData({
        ...unitData,
        services: unitData.services.map((s) =>
          s.id === currentService.id ? currentService : s
        ),
      });
    } else {
      // Add new service
      const newService = {
        ...currentService,
        id: Date.now().toString(),
      };
      setUnitData({
        ...unitData,
        services: [...unitData.services, newService],
      });
    }

    // Reset form
    setCurrentService({
      id: '',
      name: '',
      description: '',
      price: 0,
      currency: 'VND',
    });
    setShowServiceForm(false);
  };

  // Handle edit service
  const handleEditService = (service: UnitService) => {
    setCurrentService(service);
    setShowServiceForm(true);
  };

  // Handle delete service
  const handleDeleteService = (id: string) => {
    setUnitData({
      ...unitData,
      services: unitData.services.filter((s) => s.id !== id),
    });
  };

  // Handle add image
  const handleAddImage = () => {
    // In a real app, this would open image picker
    // For now, we'll add a placeholder image
    const newImage: MediaModel = {
      id: Date.now().toString(),
      filePath: PLACEHOLDER_IMAGE,
      fileType: 'image/jpeg',
      hash: `hash_${Date.now()}`,
    };

    setUnitData({
      ...unitData,
      images: [...unitData.images, newImage],
    });
  };

  // Handle delete image
  const handleDeleteImage = (id: string) => {
    setUnitData({
      ...unitData,
      images: unitData.images.filter((img) => img.id !== id),
    });
  };

  // Save unit
  const handleSave = () => {
    onSave(unitData);
    onClose();
  };

  // Render sport type item
  const renderSportTypeItem = ({ item }: { item: SportTypeModel }) => {
    const isSelected = unitData.sportTypes.some((st) => st.id === item.id);

    return (
      <TouchableOpacity
        style={[
          styles.sportTypeItem,
          isSelected && styles.sportTypeItemSelected,
        ]}
        onPress={() => handleToggleSportType(item)}
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
  };

  // Render price item
  const renderPriceItem = ({ item }: { item: UnitPrice }) => {
    return (
      <View style={styles.itemCard}>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>
            {item.startTime} - {item.endTime}
          </Text>
          <Text style={styles.itemSubtitle}>
            {item.price.toLocaleString()} {item.currency}
          </Text>
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.editItemButton}
            onPress={() => handleEditPrice(item)}
          >
            <Text style={styles.editItemText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteItemButton}
            onPress={() => handleDeletePrice(item.id)}
          >
            <Text style={styles.deleteItemText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render service item
  const renderServiceItem = ({ item }: { item: UnitService }) => {
    return (
      <View style={styles.itemCard}>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemSubtitle}>
            {item.price.toLocaleString()} {item.currency}
          </Text>
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.editItemButton}
            onPress={() => handleEditService(item)}
          >
            <Text style={styles.editItemText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteItemButton}
            onPress={() => handleDeleteService(item.id)}
          >
            <Text style={styles.deleteItemText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render image item
  const renderImageItem = ({ item }: { item: MediaModel }) => {
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.filePath }} style={styles.image} />
        <TouchableOpacity
          style={styles.deleteImageButton}
          onPress={() => handleDeleteImage(item.id)}
        >
          <Text style={styles.deleteImageText}>X</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <ShadowedView style={styles.header}>
          <Text style={styles.title}>{unit ? 'Edit Unit' : 'Add Unit'}</Text>
          <Pressable onPress={onClose}>
            <CloseIcon color={theme.icon} />
          </Pressable>
        </ShadowedView>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
		  showsVerticalScrollIndicator={false}
        >
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.formField}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={unitData.name}
                onChangeText={(text) => handleUpdateUnitField('name', text)}
                placeholder="Unit name"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formField, styles.halfWidth]}>
                <Text style={styles.label}>Open Time</Text>
                <TextInput
                  style={styles.input}
                  value={unitData.openTime}
                  onChangeText={(text) =>
                    handleUpdateUnitField('openTime', text)
                  }
                  placeholder="HH:MM"
                />
              </View>

              <View style={[styles.formField, styles.halfWidth]}>
                <Text style={styles.label}>Close Time</Text>
                <TextInput
                  style={styles.input}
                  value={unitData.closeTime}
                  onChangeText={(text) =>
                    handleUpdateUnitField('closeTime', text)
                  }
                  placeholder="HH:MM"
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={unitData.phone}
                onChangeText={(text) => handleUpdateUnitField('phone', text)}
                placeholder="Phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={unitData.description}
                onChangeText={(text) =>
                  handleUpdateUnitField('description', text)
                }
                placeholder="Description"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>

            <View style={styles.formField}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={unitData.address.address}
                onChangeText={(text) =>
                  handleUpdateAddressField('address', text)
                }
                placeholder="Street address"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formField, styles.halfWidth]}>
                <Text style={styles.label}>Province</Text>
                <TextInput
                  style={styles.input}
                  value={unitData.address.province}
                  onChangeText={(text) =>
                    handleUpdateAddressField('province', text)
                  }
                  placeholder="Province"
                />
              </View>

              <View style={[styles.formField, styles.halfWidth]}>
                <Text style={styles.label}>District</Text>
                <TextInput
                  style={styles.input}
                  value={unitData.address.district}
                  onChangeText={(text) =>
                    handleUpdateAddressField('district', text)
                  }
                  placeholder="District"
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Ward</Text>
              <TextInput
                style={styles.input}
                value={unitData.address.ward}
                onChangeText={(text) => handleUpdateAddressField('ward', text)}
                placeholder="Ward"
              />
            </View>
          </View>

          {/* Sport Types */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sport Types</Text>
            <Text style={styles.sectionDescription}>
              Select all sport types available at this unit
            </Text>

            <FlatList
              data={sportTypes}
              renderItem={renderSportTypeItem}
              keyExtractor={(item) => item.id}
              horizontal={false}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={styles.sportTypeList}
            />
          </View>

          {/* Images */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Images</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddImage}
              >
                <Text style={styles.addButtonText}>+ Add Image</Text>
              </TouchableOpacity>
            </View>

            {unitData.images.length > 0 ? (
              <FlatList
                data={unitData.images}
                renderItem={renderImageItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageList}
              />
            ) : (
              <Text style={styles.emptyText}>No images added yet</Text>
            )}
          </View>

          {/* Unit Prices */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Prices</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setCurrentPrice({
                    id: '',
                    price: 0,
                    currency: 'VND',
                    startTime: '',
                    endTime: '',
                  });
                  setShowPriceForm(true);
                }}
              >
                <Text style={styles.addButtonText}>+ Add Price</Text>
              </TouchableOpacity>
            </View>

            {unitData.prices.length > 0 ? (
              <FlatList
                data={unitData.prices}
                renderItem={renderPriceItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.itemList}
              />
            ) : (
              <Text style={styles.emptyText}>No prices added yet</Text>
            )}
          </View>

          {/* Unit Services */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Services</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setCurrentService({
                    id: '',
                    name: '',
                    description: '',
                    price: 0,
                    currency: 'VND',
                  });
                  setShowServiceForm(true);
                }}
              >
                <Text style={styles.addButtonText}>+ Add Service</Text>
              </TouchableOpacity>
            </View>

            {unitData.services.length > 0 ? (
              <FlatList
                data={unitData.services}
                renderItem={renderServiceItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.itemList}
              />
            ) : (
              <Text style={styles.emptyText}>No services added yet</Text>
            )}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={onClose}
              buttonStyle={styles.cancelButton}
              textStyle={styles.cancelButtonText}
            />
            <Button
              title="Save"
              onPress={handleSave}
              buttonStyle={styles.saveButton}
            />
          </View>
        </ScrollView>
      </View>

      {/* Price Form Modal */}
      <BaseModal
        visible={showPriceForm}
        onClose={() => setShowPriceForm(false)}
      >
        <View style={styles.formModal}>
          <Text style={styles.formModalTitle}>
            {currentPrice.id ? 'Edit Price' : 'Add Price'}
          </Text>

          <View style={styles.formRow}>
            <View style={[styles.formField, styles.halfWidth]}>
              <Text style={styles.label}>Start Time</Text>
              <TextInput
                style={styles.input}
                value={currentPrice.startTime}
                onChangeText={(text) =>
                  setCurrentPrice({ ...currentPrice, startTime: text })
                }
                placeholder="HH:MM"
              />
            </View>

            <View style={[styles.formField, styles.halfWidth]}>
              <Text style={styles.label}>End Time</Text>
              <TextInput
                style={styles.input}
                value={currentPrice.endTime}
                onChangeText={(text) =>
                  setCurrentPrice({ ...currentPrice, endTime: text })
                }
                placeholder="HH:MM"
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formField, styles.halfWidth]}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                value={currentPrice.price.toString()}
                onChangeText={(text) =>
                  setCurrentPrice({
                    ...currentPrice,
                    price: parseFloat(text) || 0,
                  })
                }
                placeholder="Price"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.formField, styles.halfWidth]}>
              <Text style={styles.label}>Currency</Text>
              <TextInput
                style={styles.input}
                value={currentPrice.currency}
                onChangeText={(text) =>
                  setCurrentPrice({ ...currentPrice, currency: text })
                }
                placeholder="Currency"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={() => setShowPriceForm(false)}
              buttonStyle={styles.cancelButton}
              textStyle={styles.cancelButtonText}
            />
            <Button
              title="Save"
              onPress={handleAddPrice}
              buttonStyle={styles.saveButton}
            />
          </View>
        </View>
      </BaseModal>

      {/* Service Form Modal */}
      <BaseModal
        visible={showServiceForm}
        onClose={() => setShowServiceForm(false)}
      >
        <View style={styles.formModal}>
          <Text style={styles.formModalTitle}>
            {currentService.id ? 'Edit Service' : 'Add Service'}
          </Text>

          <View style={styles.formField}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={currentService.name}
              onChangeText={(text) =>
                setCurrentService({ ...currentService, name: text })
              }
              placeholder="Service name"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={currentService.description}
              onChangeText={(text) =>
                setCurrentService({ ...currentService, description: text })
              }
              placeholder="Description"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formField, styles.halfWidth]}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                value={currentService.price.toString()}
                onChangeText={(text) =>
                  setCurrentService({
                    ...currentService,
                    price: parseFloat(text) || 0,
                  })
                }
                placeholder="Price"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.formField, styles.halfWidth]}>
              <Text style={styles.label}>Currency</Text>
              <TextInput
                style={styles.input}
                value={currentService.currency}
                onChangeText={(text) =>
                  setCurrentService({ ...currentService, currency: text })
                }
                placeholder="Currency"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={() => setShowServiceForm(false)}
              buttonStyle={styles.cancelButton}
              textStyle={styles.cancelButtonText}
            />
            <Button
              title="Save"
              onPress={handleAddService}
              buttonStyle={styles.saveButton}
            />
          </View>
        </View>
      </BaseModal>
    </BaseModal>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.backgroundLight,
      borderTopLeftRadius: Radius.lg,
      borderTopRightRadius: Radius.lg,
      height: '90%',
      width: '100%',
      padding: wp(5),
    },
    header: {
      flexDirection: 'row',
      width: '100%',
	  backgroundColor: theme.backgroundLight,
      justifyContent: 'space-between',
	  shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    title: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.xl,
      color: theme.textDark,
      marginBottom: hp(2),
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: hp(5),
    },
    section: {
      marginBottom: hp(3),
    },
    sectionTitle: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.md,
      color: theme.textDark,
      marginBottom: hp(1),
    },
    sectionDescription: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textLight,
      marginBottom: hp(1),
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
    formRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: hp(2),
    },
    halfWidth: {
      width: '48%',
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
      flexWrap: 'wrap',
      marginTop: hp(1),
    },
    sportTypeItem: {
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.borderLight,
      borderRadius: Radius.xs,
      paddingHorizontal: wp(3),
      paddingVertical: hp(1),
      marginRight: wp(2),
      marginBottom: hp(1),
    },
    sportTypeItemSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    sportTypeText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.xs,
      color: theme.textDark,
    },
    sportTypeTextSelected: {
      color: theme.white,
    },
    addButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: wp(3),
      paddingVertical: hp(0.5),
      borderRadius: Radius.xs,
    },
    addButtonText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.xs,
      color: theme.white,
    },
    emptyText: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      color: theme.textLight,
      marginTop: hp(1),
      marginBottom: hp(1),
    },
    imageList: {
      marginTop: hp(1),
    },
    imageContainer: {
      width: wp(25),
      height: wp(25),
      marginRight: wp(2),
      borderRadius: Radius.xs,
      overflow: 'hidden',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    deleteImageButton: {
      position: 'absolute',
      top: 5,
      right: 5,
      backgroundColor: theme.error,
      width: wp(5),
      height: wp(5),
      borderRadius: Radius.full,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteImageText: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.xs,
      color: theme.white,
    },
    itemList: {
      marginTop: hp(1),
    },
    itemCard: {
      backgroundColor: theme.white,
      borderRadius: Radius.xs,
      padding: wp(3),
      marginBottom: hp(1),
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    itemContent: {
      flex: 1,
    },
    itemTitle: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.textDark,
    },
    itemSubtitle: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.xs,
      color: theme.primary,
      marginTop: hp(0.5),
    },
    itemDescription: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textLight,
      marginTop: hp(0.5),
    },
    itemActions: {
      flexDirection: 'column',
      justifyContent: 'center',
      gap: hp(1),
    },
    editItemButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: wp(2),
      paddingVertical: hp(0.3),
      borderRadius: Radius.xs,
    },
    editItemText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.xs,
      color: theme.white,
    },
    deleteItemButton: {
      backgroundColor: theme.error,
      paddingHorizontal: wp(2),
      paddingVertical: hp(0.3),
      borderRadius: Radius.xs,
    },
    deleteItemText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.xs,
      color: theme.white,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: hp(2),
    },
    cancelButton: {
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.borderLight,
      width: '48%',
    },
    cancelButtonText: {
      color: theme.textDark,
    },
    saveButton: {
      width: '48%',
    },
    formModal: {
      backgroundColor: theme.backgroundLight,
      borderTopLeftRadius: Radius.lg,
      borderTopRightRadius: Radius.lg,
      padding: wp(5),
      width: '100%',
    },
    formModalTitle: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.lg,
      color: theme.textDark,
      marginBottom: hp(2),
    },
  });

export default UnitForm;
