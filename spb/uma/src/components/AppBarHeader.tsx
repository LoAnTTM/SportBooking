import React from 'react'
import { Appbar, Switch } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useThemeToggle } from '../hooks/themes'; 

interface AppBarProps {
	// title: string
	navigateTo: string
}

const AppBar: React.FC<AppBarProps> = ({ navigateTo }) => {
	const navigation = useNavigation()
	const { isDarkTheme, toggleTheme } = useThemeToggle();

	return (
		<Appbar.Header>
			<Appbar.Action
				icon="home"
				onPress={() => navigation.navigate(navigateTo as never)}
			/>

			<Switch
				color={isDarkTheme ? 'white' : 'black'}
				style={{ flex: 1, justifyContent: 'flex-end' }}
				value={isDarkTheme} 
				onValueChange={toggleTheme} 
			/>
			{/* <Appbar.Content title={title} /> */}
		</Appbar.Header>
	)
}

export default AppBar
