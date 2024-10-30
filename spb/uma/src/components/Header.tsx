import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const Header = ({ title, hasSearch, onSearch }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>{title}</Text>
      {hasSearch && (
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          onChangeText={onSearch}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: { /* styles */ },
  title: { /* styles */ },
  searchInput: { /* styles */ }
});

export default Header;
