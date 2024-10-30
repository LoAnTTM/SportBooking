import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { MD2Colors } from 'react-native-paper';

interface ButtonProps {
  label: string;
  onPress: () => void;
  icon?: any;   
  style?: ViewStyle;  
}

const Button: React.FC<ButtonProps> = ({ label, onPress, icon, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {icon && <Image source={icon} style={styles.icon} />} 
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '60%',
    height: 50,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

export default Button;
