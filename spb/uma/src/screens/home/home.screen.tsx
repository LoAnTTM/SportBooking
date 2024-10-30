import AppBar from "@/components/AppBarHeader";
import { RootStackParamList } from "@/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text } from "react-native";

type HomeScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	'Home'
>

type Props = {
	navigation: HomeScreenNavigationProp
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {

    return (
        <View >
            <AppBar navigateTo="Onboarding" />
            <Text>Home</Text>
        </View>
    )
}


export default HomeScreen; 