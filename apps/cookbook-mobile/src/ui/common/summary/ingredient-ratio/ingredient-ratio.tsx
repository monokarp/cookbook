import { View } from "react-native";
import { Text, ToggleButton } from "react-native-paper";
import { styles } from "./ingredient-ratio.style";

interface RatioProps {
    value: number;
    incrementValue?: number;
    onChange: (value: number) => void;
}

const round = num => Number((num).toFixed(1));

export function IngredientRatio({ value: ratio, incrementValue = 0.5, onChange }: RatioProps) {
    const increment = () => onChange(round(ratio + incrementValue));
    const decrement = () => onChange(round(ratio - incrementValue ? ratio - incrementValue : ratio));;

    return (
        <View style={styles.boxContainer}>
            <Text style={styles.label} variant="headlineSmall">{ratio}</Text>
            {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
            <ToggleButton.Row style={{ margin: 10 }} onValueChange={() => { }} value="">
                <ToggleButton
                    icon="minus"
                    onPress={decrement}
                />
                <ToggleButton
                    icon="plus"
                    onPress={increment}
                />
            </ToggleButton.Row>
        </View>
    );
}