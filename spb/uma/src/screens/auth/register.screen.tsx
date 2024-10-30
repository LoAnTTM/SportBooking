import Navigation, { RootStackParamList } from '@/navigation'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import AppBar from '@/components/AppBarHeader'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { register } from '../../services/authService'
import Button from '@/components/AuthButton'
import InputField from '@/components/InputField'

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>

type Props = {
  navigation: RegisterScreenNavigationProp
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const response = await register(email, password);

    if (response) {
      Alert.alert('Success', 'Registration successful');
      navigation.navigate('Login'); 
    } else {
      Alert.alert('Error', 'Registration failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <LoadingSpinner /> */}
      <AppBar navigateTo="Onboarding" />

      <ScrollView contentContainerStyle={styles.contentContainer}
      automaticallyAdjustKeyboardInsets={true}>
        <Text style={styles.title}>Get start with app</Text>

        <InputField
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <InputField
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <InputField
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />

      <View style={styles.loginContainer}>
          <Text style={styles.loginText}>If has account, </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login here</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button label="Register" onPress={handleRegister} />

        <View style={styles.separatorContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or</Text>
        <View style={styles.line} />
      </View>

        <Button label= "Google" onPress={() => console.log("Google")}/>
        <Button label= "Facebook" onPress={() => console.log("Facebook")}/>
      </View>

      <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
        <Text style={styles.linkText}>Terms and Conditions</Text>
      </Text>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
		flex: 1,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Đẩy sang phải như trong hình
    width: '100%', // Để căn chỉnh phù hợp với màn hình
    paddingHorizontal: 20,
  },
  loginText: {
    color: '#808080', // Màu xám cho phần văn bản "If has account,"
  },
  loginLink: {
    color: '#000', 
    fontWeight: 'bold', 
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: '90%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#D3D3D3', 
  },
  orText: {
    marginHorizontal: 10,
    color: '#808080', 
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  termsText: {
    textAlign: 'center',
    color: '#808080',
    marginTop: 20,
  },
  linkText: {
    fontWeight: 'bold',
    color: '#000', 
    textDecorationLine: 'underline',
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
})

export default RegisterScreen
