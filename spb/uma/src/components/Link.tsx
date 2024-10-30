import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

interface LinkProps {
  label: string;
  onPress: () => void;
  style?: object;  // Optional custom styles
}

const Link: React.FC<LinkProps> = ({ label, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.linkText, style]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linkText: {
    color: '#1E90FF',  // A common link color (blue)
    textDecorationLine: 'underline', // Underlined to look like a link
    marginVertical: 5,
  },
});

export default Link;
