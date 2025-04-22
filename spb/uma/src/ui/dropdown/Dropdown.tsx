import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated, FlatList, Keyboard, Modal, Pressable, StyleProp, StyleSheet, Text, TextInput,
  TouchableOpacity, View, ViewStyle
} from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';

import { DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import { unicodeToASCII } from '@/helpers/function';
import DownIcon from '@/ui/icon/Down';
import SearchIcon from '@/ui/icon/Search';

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  value: string;
  items: DropdownItem[];
  onSelect: (value: string) => void;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
}

const Dropdown: FC<DropdownProps> = ({
  label,
  value,
  items,
  onSelect,
  placeholder = 'Select an option',
  containerStyle,
  disabled = false,
  searchable = true,
  searchPlaceholder = 'Search...',
}) => {
  const { theme } = React.useContext(ThemeContext);
  const styles = createStyles(theme);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(
    items.find((item) => item.value === value) || null
  );

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setSelectedItem(items.find((item) => item.value === value) || null);
  }, [value, items]);

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOpen, rotateAnim]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(items);
    } else {
      const query = unicodeToASCII(searchQuery.toLowerCase());
      const filtered = items.filter((item) =>
        unicodeToASCII(item.label.toLowerCase()).includes(query)
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    } else {
      setSearchQuery('');
    }
  }, [isOpen, searchable]);

  const toggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  }, [isOpen, disabled]);

  const handleSelect = useCallback(
    (item: DropdownItem) => {
      Keyboard.dismiss(); // Dismiss keyboard before closing modal

      setSelectedItem(item);
      onSelect(item.value);

      // Small delay to ensure smooth animation after selection
      setTimeout(() => {
        setIsOpen(false);
        setSearchQuery('');
      }, 100);
    },
    [onSelect]
  );

  const handleCloseModal = useCallback(() => {
    Keyboard.dismiss();
    setIsOpen(false);
    setSearchQuery('');
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: DropdownItem }) => {
      const isSelected = selectedItem?.value === item.value;

      return (
        <TouchableOpacity
          style={[styles.item, isSelected && styles.selectedItem]}
          onPress={() => handleSelect(item)}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.itemText, isSelected && styles.selectedItemText]}
            numberOfLines={1}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedItem, handleSelect, styles]
  );

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Pressable
        style={[styles.button, disabled && styles.disabledButton]}
        onPress={toggleDropdown}
        disabled={disabled}
      >
        <Text
          style={[
            styles.buttonText,
            !selectedItem && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>

        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <DownIcon
            size={18}
            color={disabled ? theme.textLight : theme.textDark}
          />
        </Animated.View>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
        statusBarTranslucent
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseModal}
        >
          <Pressable style={styles.modalContainer}>
            <ShadowedView style={styles.modalContent}>
              {searchable && (
                <View style={styles.searchContainer}>
                  <SearchIcon
                    size={DEFAULT_ICON_SIZE - 4}
                    color={theme.primary}
                    style={styles.searchIcon}
                  />
                  <TextInput
                    ref={searchInputRef}
                    style={styles.searchInput}
                    placeholder={searchPlaceholder}
                    placeholderTextColor={theme.textLight}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCorrect={false}
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      if (filteredItems.length > 0) {
                        handleSelect(filteredItems[0]);
                      }
                    }}
                  />
                </View>
              )}

              {filteredItems.length > 0 ? (
                <FlatList
                  ref={flatListRef}
                  data={filteredItems}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.value}
                  showsVerticalScrollIndicator={false}
                  style={styles.flatList}
                  // eslint-disable-next-line react/no-unstable-nested-components
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                  keyboardShouldPersistTaps="always"
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                  removeClippedSubviews={false}
                />
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No results found</Text>
                </View>
              )}
            </ShadowedView>
          </Pressable>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    label: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.textDark,
      marginBottom: hp(0.5),
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: hp(1.5),
      paddingHorizontal: wp(4),
      borderWidth: 1,
      borderColor: theme.borderLight,
      borderRadius: Radius.md,
      backgroundColor: theme.backgroundLight,
    },
    disabledButton: {
      backgroundColor: theme.disable,
      borderColor: theme.borderLight,
    },
    buttonText: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.md,
      color: theme.textDark,
      flex: 1,
      marginRight: wp(2),
    },
    placeholderText: {
      color: theme.textLight,
    },
    disabledText: {
      color: theme.textLight,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.overlay,
    },
    modalContainer: {
      margin: wp(4),
    },
    modalContent: {
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.md,
      maxHeight: hp(40),
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(3),
      paddingVertical: hp(1.2),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
      backgroundColor: theme.backgroundDark,
      borderTopLeftRadius: Radius.md,
      borderTopRightRadius: Radius.md,
    },
    searchIcon: {
      marginRight: wp(2),
    },
    searchInput: {
      flex: 1,
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.md,
      color: theme.textDark,
      padding: 0,
    },
    flatList: {
      padding: wp(2),
      maxHeight: hp(35),
    },
    item: {
      paddingVertical: hp(1.5),
      paddingHorizontal: wp(4),
      borderRadius: Radius.sm,
    },
    selectedItem: {
      backgroundColor: theme.backgroundDark,
    },
    itemText: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.md,
      color: theme.textDark,
    },
    selectedItemText: {
      ...fontFamily.POPPINS_MEDIUM,
      color: theme.primary,
    },
    separator: {
      height: 0.5,
      backgroundColor: theme.borderLight,
    },
    noResultsContainer: {
      paddingVertical: hp(3),
      alignItems: 'center',
    },
    noResultsText: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.md,
      color: theme.textLight,
    },
  });

export default Dropdown;
