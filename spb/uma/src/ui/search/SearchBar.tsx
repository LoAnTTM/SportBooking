import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp } from '@/helpers/dimensions';
import i18next from '@/helpers/i18n';
import CloseIcon from '@/ui/icon/Close';
import SearchIcon from '@/ui/icon/Search';
import { useEventStore } from '@/zustand';

import FilterIcon from '../icon/Filter';

interface SearchBarProps {
  placeholder: string;
  query: string;
  onQueryChange: (text: string) => void;
  onSubmit: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  query,
  onQueryChange,
  onSubmit,
}) => {
  const [placeholderAnim] = useState(new Animated.Value(1));
  const inputRef = useRef<TextInput>(null);
  const focus = useEventStore.use.focus();
  const setFocus = useEventStore.use.setFocus();

  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  useEffect(() => {
    Animated.timing(placeholderAnim, {
      toValue: query.length > 0 ? 0 : focus ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [focus, placeholderAnim, query]);

  const handleClear = () => {
    onQueryChange('');
  };

  const handleFocus = () => setFocus(true);
  const handleBlur = () => query.length === 0 && setFocus(false);

  return (
    <View style={styles.searchBar}>
      <Pressable
        style={styles.icon}
        onPress={() => {
          setFocus(true);
          inputRef.current?.focus();
        }}
      >
        <SearchIcon color={theme.primary} />
      </Pressable>
      <Animated.View
        style={[
          styles.placeholder,
          {
            opacity: placeholderAnim,
            transform: [
              {
                translateY: placeholderAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.placeholderText1}>
          {i18next.t('search.placeholder')}
        </Text>
        <Text style={styles.placeholderText2}>
          {i18next.t('search.placeholder_description')}
        </Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.inputContent,
          {
            opacity: placeholderAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={query}
          placeholder={placeholder}
          onChangeText={onQueryChange}
          onSubmitEditing={onSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {query.length > 0 && (
          <Pressable style={styles.icon} onPress={handleClear}>
            <CloseIcon size={DEFAULT_ICON_SIZE - 4} color={theme.icon} />
          </Pressable>
        )}
      </Animated.View>
      <Pressable style={styles.icon}>
        <FilterIcon color={theme.icon} />
      </Pressable>
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    searchBar: {
      height: '100%',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.xs,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
      overflow: 'hidden',
    },
    input: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      height: '100%',
      flex: 1,
      color: theme.textLight,
    },
    icon: {
      paddingHorizontal: hp(2),
      height: '100%',
      justifyContent: 'center',
    },
    placeholder: {
      position: 'absolute',
      left: DEFAULT_ICON_SIZE + hp(4),
      justifyContent: 'center',
      backgroundColor: theme.backgroundLight,
      height: '100%',
      width: '100%',
    },
    placeholderText1: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.primary,
    },
    placeholderText2: {
      ...fontFamily.RALEWAY_LIGHT,
      fontSize: fontSize.xs,
      color: theme.textLight,
    },
    inputContent: {
      height: '100%',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default SearchBar;
