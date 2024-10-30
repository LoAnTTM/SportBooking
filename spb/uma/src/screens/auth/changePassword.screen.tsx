import AppBar from '@/components/AppBarHeader'
import { RootStackParamList } from '@/navigation'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import InputField from '@/components/InputField'
import Button from '@/components/AuthButton'

type ChangePasswordScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	'ChangePassword'
>

type Props = {
	navigation: ChangePasswordScreenNavigationProp
}

const ChangePasswordScreen: React.FC<Props> = ({ navigation }) => {
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    const handlePasswordChange = () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <AppBar navigateTo="Onboarding" />

            <ScrollView contentContainerStyle={styles.contentContainer}
      					automaticallyAdjustKeyboardInsets={true}>
            <Text style={styles.title}>Change Password</Text>
            <InputField
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <InputField
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <View style={styles.buttonContainer}>
            <Button label="Change Password" onPress={handlePasswordChange} />
            </View>

            </ScrollView>
        </View>
    );
};

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
}); 

export default ChangePasswordScreen