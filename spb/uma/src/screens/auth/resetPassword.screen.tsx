import AppBar from '@/components/AppBarHeader'
import { RootStackParamList } from '@/navigation'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import InputField from '@/components/InputField'
import Button from '@/components/AuthButton'


type ResetPasswordScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	'ResetPassword'
>

type Props = {
	navigation: ResetPasswordScreenNavigationProp
}

const ResetPasswordScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('') 

    const handleResetPassword = () => {
        navigation.navigate('Login')
    }

    return (
        <View style={styles.container}>
            <AppBar navigateTo="Onboarding"/>
            <ScrollView contentContainerStyle={styles.contentContainer}
      					automaticallyAdjustKeyboardInsets={true}>
            <Text style={styles.title}>Reset Password</Text>
            <InputField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            
            <View style={styles.buttonContainer}>
                <Button
                    label="Reset Password"
                    onPress={handleResetPassword}
                />
            </View>
            </ScrollView>
        </View>
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
    buttonContainer: {
		alignItems: 'center',
		marginVertical: 10,
	},
})

export default ResetPasswordScreen