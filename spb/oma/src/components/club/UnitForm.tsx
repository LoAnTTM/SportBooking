import React, { FC, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Image,
  ScrollView
} from 'react-native';

import { Unit, UnitPrice, UnitService } from '@/types/club';
import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { hp, wp } from '@/helpers/dimensions';
import Button from '@/ui/button/BaseButton';
import { SportTypeModel } from '@/types/model';
import BaseModal from '@/ui/modal/BaseModal';

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
  theme 
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
  
  // Handle unit field updates
  const handleUpdateUnitField = (field: keyof Unit, value: string) => {
    setUnitData(prevUnit => ({
      ...prevUnit,
      [field]: value
    }));
  };
  
  // Toggle sport type selection
  const toggleSportType = (sportType: SportTypeModel) => {
    const isSelected = unitData.sportTypes.some(st => st.id === sportType.id);
    
    if (isSelected) {
      setUnitData({
        ...unitData,
        sportTypes: unitData.sportTypes.filter(st => st.id !== sportType.id)
      });
    } else {
      setUnitData({
        ...unitData,
        sportTypes: [...unitData.sportTypes, sportType]
      });
    }
  };
  
  // Add price
  const handleAddPrice = () => {
    if (currentPrice.startTime && currentPrice.endTime && currentPrice.price > 0) {
      const newPrice = {
        ...currentPrice,
        id: currentPrice.id || Date.now().toString(),
      };
      
      if (currentPrice.id) {
        // Update existing price
        setUnitData({
          ...unitData,
          prices: unitData.prices.map(p => 
            p.id === currentPrice.id ? newPrice : p
          )
        });
      } else {
        // Add new price
        setUnitData({
          ...unitData,
          prices: [...unitData.prices, newPrice]
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
    }
  };
  
  // Edit price
  const handleEditPrice = (price: UnitPrice) => {
    setCurrentPrice(price);
    setShowPriceForm(true);
  };
  
  // Delete price
  const handleDeletePrice = (id: string) => {
    setUnitData({
      ...unitData,
      prices: unitData.prices.filter(p => p.id !== id)
    });
  };
  
  // Add service
  const handleAddService = () => {
    if (currentService.name && currentService.price > 0) {
      const newService = {
        ...currentService,
        id: currentService.id || Date.now().toString(),
      };
      
      if (currentService.id) {
        // Update existing service
        setUnitData({
          ...unitData,
          services: unitData.services.map(s => 
            s.id === currentService.id ? newService : s
          )
        });
      } else {
        // Add new service
        setUnitData({
          ...unitData,
          services: [...unitData.services, newService]
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
    }
  };
  
  // Edit service
  const handleEditService = (service: UnitService) => {
    setCurrentService(service);
    setShowServiceForm(true);
  };
  
  // Delete service
  const handleDeleteService = (id: string) => {
    setUnitData({
      ...unitData,
      services: unitData.services.filter(s => s.id !== id)
    });
  };
  
  // Save unit
  const handleSave = () => {
    onSave(unitData);
    onClose();
  };
  
  // Render sport type item
  const renderSportTypeItem = ({ item }: { item: SportTypeModel }) => {
    const isSelected = unitData.sportTypes.some(st => st.id === item.id);
    
    return (
      <TouchableOpacity 
        style={[styles.sportTypeItem, isSelected && styles.sportTypeItemSelected]} 
        onPress={() => toggleSportType(item)}
      >
        <Text style={[styles.sportTypeText, isSelected && styles.sportTypeTextSelected]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  
  // Render price item
  const renderPriceItem = ({ item }: { item: UnitPrice }) => {
    return (
      <View style={styles.priceItem}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceTime}>{item.startTime} - {item.endTime}</Text>
          <Text style={styles.priceValue}>{item.price.toLocaleString()} {item.currency}</Text>
        </View>
        <View style={styles.priceActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]} 
            onPress={() => handleEditPrice(item)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={() => handleDeletePrice(item.id)}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  // Render service item
  const renderServiceItem = ({ item }: { item: UnitService }) => {
    return (
      <View style={styles.serviceItem}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <Text style={styles.serviceDescription}>{item.description}</Text>
          <Text style={styles.servicePrice}>{item.price.toLocaleString()} {item.currency}</Text>
        </View>
        <View style={styles.serviceActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]} 
            onPress={() => handleEditService(item)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={() => handleDeleteService(item.id)}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>{unit ? 'Edit Unit' : 'Add Unit'}</Text>
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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
                  onChangeText={(text) => handleUpdateUnitField('openTime', text)}
                  placeholder="HH:MM"
                />
              </View>
              
              <View style={[styles.formField, styles.halfWidth]}>
                <Text style={styles.label}>Close Time</Text>
                <TextInput
                  style={styles.input}
                  value={unitData.closeTime}
                  onChangeText={(text) => handleUpdateUnitField('closeTime', text)}
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
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={unitData.address.address}
                onChangeText={(text) => {
                  const newAddress = {...unitData.address, address: text};
                  setUnitData({...unitData, address: newAddress});
                }}
                placeholder="Address"
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={unitData.description}
                onChangeText={(text) => handleUpdateUnitField('description', text)}
                placeholder="Description"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
          
          {/* Sport Types */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sport Types</Text>
            <Text style={styles.sectionDescription}>Select all sport types available at this unit</Text>
            
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
          
          {/* Prices */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Prices</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowPriceForm(true)}
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
              />
            ) : (
              <Text style={styles.emptyText}>No prices added yet</Text>
            )}
          </View>
          
          {/* Services */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Services</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowServiceForm(true)}
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
      <BaseModal visible={showPriceForm} onClose={() => setShowPriceForm(false)}>
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
                onChangeText={(text) => setCurrentPrice({...currentPrice, startTime: text})}
                placeholder="HH:MM"
              />
            </View>
            
            <View style={[styles.formField, styles.halfWidth]}>
              <Text style={styles.label}>End Time</Text>
              <TextInput
                style={styles.input}
                value={currentPrice.endTime}
                onChangeText={(text) => setCurrentPrice({...currentPrice, endTime: text})}
                placeholder="HH:MM"
              />
            </View>
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={currentPrice.price.toString()}
              onChangeText={(text) => setCurrentPrice({
                ...currentPrice, 
                price: text ? parseInt(text.replace(/[^0-9]/g, ''), 10) : 0
              })}
              placeholder="Price"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Currency</Text>
            <TextInput
              style={styles.input}
              value={currentPrice.currency}
              onChangeText={(text) => setCurrentPrice({...currentPrice, currency: text})}
              placeholder="Currency"
            />
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
      <BaseModal visible={showServiceForm} onClose={() => setShowServiceForm(false)}>
        <View style={styles.formModal}>
          <Text style={styles.formModalTitle}>
            {currentService.id ? 'Edit Service' : 'Add Service'}
          </Text>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={currentService.name}
              onChangeText={(text) => setCurrentService({...currentService, name: text})}
              placeholder="Service name"
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={currentService.description}
              onChangeText={(text) => setCurrentService({...currentService, description: text})}
              placeholder="Description"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={currentService.price.toString()}
              onChangeText={(text) => setCurrentService({
                ...currentService, 
                price: text ? parseInt(text.replace(/[^0-9]/g, ''), 10) : 0
              })}
              placeholder="Price"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Currency</Text>
            <TextInput
              style={styles.input}
              value={currentService.currency}
              onChangeText={(text) => setCurrentService({...currentService, currency: text})}
              placeholder="Currency"
            />
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

const createStyles = (theme: IColorScheme) => StyleSheet.create({
  container: {
    backgroundColor: theme.backgroundLight,
    borderRadius: Radius.md,
    width: '90%',
    maxHeight: '90%',
    padding: hp(2),
  },
  title: {
    ...fontFamily.RALEWAY_BOLD,
    fontSize: fontSize.xl,
    color: theme.textDark,
    marginBottom: hp(2),
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp(2),
  },
  section: {
    backgroundColor: theme.white,
    borderRadius: Radius.md,
    marginBottom: hp(2),
    padding: hp(2),
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    ...fontFamily.RALEWAY_SEMIBOLD,
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
    backgroundColor: theme.backgroundLight,
    borderRadius: Radius.full,
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    margin: wp(1),
    borderWidth: 1,
    borderColor: theme.borderLight,
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
  emptyText: {
    ...fontFamily.POPPINS_REGULAR,
    fontSize: fontSize.sm,
    color: theme.textLight,
    textAlign: 'center',
    marginVertical: hp(2),
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.backgroundLight,
    borderRadius: Radius.xs,
    padding: hp(1.5),
    marginBottom: hp(1),
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  priceInfo: {
    flex: 1,
  },
  priceTime: {
    ...fontFamily.RALEWAY_BOLD,
    fontSize: fontSize.sm,
    color: theme.textDark,
  },
  priceValue: {
    ...fontFamily.POPPINS_REGULAR,
    fontSize: fontSize.xs,
    color: theme.textDark,
  },
  priceActions: {
    flexDirection: 'row',
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.backgroundLight,
    borderRadius: Radius.xs,
    padding: hp(1.5),
    marginBottom: hp(1),
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    ...fontFamily.RALEWAY_BOLD,
    fontSize: fontSize.sm,
    color: theme.textDark,
  },
  serviceDescription: {
    ...fontFamily.POPPINS_REGULAR,
    fontSize: fontSize.xs,
    color: theme.textLight,
  },
  servicePrice: {
    ...fontFamily.POPPINS_REGULAR,
    fontSize: fontSize.xs,
    color: theme.textDark,
    marginTop: hp(0.5),
  },
  serviceActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2),
    borderRadius: Radius.xs,
    marginLeft: wp(1),
  },
  editButton: {
    backgroundColor: theme.primary,
  },
  deleteButton: {
    backgroundColor: theme.error,
  },
  actionButtonText: {
    ...fontFamily.POPPINS_REGULAR,
    fontSize: fontSize.xs,
    color: theme.white,
  },
  addButton: {
    backgroundColor: theme.primary,
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    borderRadius: Radius.xs,
  },
  addButtonText: {
    ...fontFamily.POPPINS_REGULAR,
    fontSize: fontSize.xs,
    color: theme.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2),
  },
  cancelButton: {
    flex: 1,
    marginRight: wp(2),
    backgroundColor: theme.backgroundLight,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  cancelButtonText: {
    color: theme.textDark,
  },
  saveButton: {
    flex: 1,
    marginLeft: wp(2),
  },
  formModal: {
    backgroundColor: theme.backgroundLight,
    borderRadius: Radius.md,
    width: '90%',
    padding: hp(2),
  },
  formModalTitle: {
    ...fontFamily.RALEWAY_BOLD,
    fontSize: fontSize.lg,
    color: theme.textDark,
    marginBottom: hp(2),
    textAlign: 'center',
  },
});

export default UnitForm;
