import { Text, View } from "react-native";
import React from "react";
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

export const LoadingSpinner = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator
                size="large"
                color={MD2Colors.blue500}
            />
            <Text>Loading...</Text>
        </View>
    )
}