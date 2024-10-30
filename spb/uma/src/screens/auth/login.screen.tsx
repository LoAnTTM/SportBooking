import { RootStackParamList } from '@/navigation'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import AppBar from '@/components/AppBarHeader'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { login } from '../../services/authService'
import Button from '@/components/AuthButton'
import InputField from '@/components/InputField'


type LoginScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	'Login'
>

type Props = {
	navigation: LoginScreenNavigationProp
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')


	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert('Please fill in both email and password.')
			return
		}

	const response = await login(email, password);
	if (response) {
		Alert.alert('Success', 'Login successful')
		navigation.navigate('Home')
	} else {
		Alert.alert('Error', 'Login failed')
	}

	}

	return (
		<SafeAreaView style={styles.container}>
			<AppBar navigateTo="Onboarding" />
			{/* <LoadingSpinner /> */}
			<ScrollView contentContainerStyle={styles.contentContainer}
      					automaticallyAdjustKeyboardInsets={true}>
				<Text style={styles.title}>Login</Text>
				<InputField
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
				/>
				{/* <Text style={styles.error}></Text> */}
				<InputField
					placeholder="Password"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
				/>
				{/* <Text style={styles.error}></Text> */}

				<View style={styles.ForgotPasswordContainer}>
					<TouchableOpacity onPress={() => navigation.navigate('ChangePassword')}>
					<Text style={styles.ForgotPasswordLink}>Forgot Password</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.buttonContainer}>
					<Button label="Login" onPress={handleLogin} />
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',

	},
	contentContainer: {
		paddingHorizontal: 20,
		justifyContent: 'center',
		paddingBottom: 20,
		paddingTop: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 20,
	},

	ForgotPasswordContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	ForgotPasswordLink: {
		fontWeight: 'bold',
		color: '#000', 
	},

	buttonContainer: {
		alignItems: 'center',
		marginVertical: 10,
	},
	error: {
		fontSize: 7,
		color: 'red',
		marginBottom: 10,
	},
})

export default LoginScreen
