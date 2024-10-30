import { RootStackParamList } from '@/navigation'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import Button from '@/components/AuthButton'
import AppBar from '../../components/AppBarHeader'


type OnboardingScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	'Onboarding'
>

type Props = {
	navigation: OnboardingScreenNavigationProp
}

const { width, height } = Dimensions.get('window');
const imageSource = require('../../../assets/img/onboarding.png'); 

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
	return (
		<View style={styles.container}>
			<AppBar navigateTo="Onboarding" />

			<View style={styles.imgContainer}>
			<Image source={imageSource} style={styles.image} resizeMode="cover" />
			{/* <Image source={imageSource} style={styles.image} resizeMode="cover" />
			<Image source={imageSource} style={styles.image} resizeMode="cover" /> */}
			</View>

			<View style={styles.buttonContainer}>
				<Button
					label="Get Started Now"
					onPress={() => navigation.navigate('Register')}
				></Button>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F5F5',
	},
	imgContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 20,
	},
	image: {
		flexDirection: 'row',
		width: (width - 40), 
		height: height * 0.75, 
		borderRadius: 8, 
	  },
	buttonContainer: {
		padding: 20,
		alignItems: 'center',
		justifyContent: 'flex-end',
		flex: 1,
	},
})

export default OnboardingScreen
