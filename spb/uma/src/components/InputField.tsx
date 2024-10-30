import React from 'react'
import { TextInput, StyleSheet, View } from 'react-native'

interface InputFieldProps {
	placeholder: string
	secureTextEntry?: boolean
	value: string
	onChangeText: (text: string) => void
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad'
}

const InputField: React.FC<InputFieldProps> = ({
	placeholder,
	secureTextEntry = false,
	value,
	keyboardType,
	onChangeText,
}) => {
	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder={placeholder}
				secureTextEntry={secureTextEntry}
				value={value}
				onChangeText={onChangeText}
				keyboardType={keyboardType}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 10,
	},
	input: {
		height: 50,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 8,
		paddingLeft: 10,
	},
})

export default InputField
