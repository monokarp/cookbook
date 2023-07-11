import { View } from "react-native";
import { Text } from "react-native-paper";

export function PrepackDetails({ route, navigation }) {
    const { prepack } = route.params;

    console.log(prepack)
    return (
        <View>
            <Text>{prepack.name}</Text>
        </View>
    );
}