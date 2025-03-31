import React, { useEffect, useState } from 'react';
import { Animated, Text, TextInput, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { DEFAULT_ICON_SIZE, IColorScheme } from '@/constants';
import i18next from '@/helpers/i18n';
import { SearchStyleProps } from '@/ui/search/types';

interface SearchBarProps extends SearchStyleProps {
  placeholder: string;
  query: string;
  onQueryChange: (text: string) => void;
  onSubmit: () => void;
  styles: any;
  theme: IColorScheme;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  query,
  onQueryChange,
  onSubmit,
  styles,
  searchBarStyle,
  inputStyle,
  theme,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.timing(placeholderAnim, {
      toValue: isFocused ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isFocused, placeholderAnim]);

  const handleClear = () => {
    onQueryChange('');
  };

  return (
    <View style={[styles.searchBar, searchBarStyle]}>
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
      <AntDesign
        style={styles.icon}
        name="search1"
        size={DEFAULT_ICON_SIZE}
        color={theme.primary}
        onPress={() => setIsFocused(true)}
      />
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
          style={[styles.input, inputStyle]}
          value={query}
          placeholder={placeholder}
          onChangeText={onQueryChange}
          onSubmitEditing={onSubmit}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            if (query.length === 0) setIsFocused(false);
          }}
        />
        {query.length > 0 && (
          <AntDesign
            style={styles.icon}
            name="close"
            size={DEFAULT_ICON_SIZE - 4}
            color={theme.icon}
            onPress={handleClear}
          />
        )}
      </Animated.View>
    </View>
  );
};
