import { View } from "react-native";
import { Text, ToggleButton } from "react-native-paper";
import { styles } from "./ingredient-ratio.style";

interface RatioProps {
    value: number;
    smallIncrement?: number;
    largeIncrement?: number;
    onChange: (value: number) => void;
}

const round = (num: number) => Number(num.toFixed(1));

export function IngredientRatio({ value: ratio, smallIncrement = 0.1, largeIncrement = 1, onChange }: RatioProps) {
    const increment = (value: number) => onChange(round(ratio + value));
    const decrement = (value: number) => onChange(round(ratio - value ? ratio - value : ratio));

    return (
        <View style={styles.boxContainer}>
            <Text style={styles.label} variant="headlineSmall">
                {ratio}
            </Text>
            <ToggleButton.Row
                style={{ margin: 10 }}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onValueChange={() => {}}
                value=""
            >
                <ToggleButton icon="minus" onPress={() => decrement(largeIncrement)} />
                <ToggleButton icon="minus-thick" onPress={() => decrement(smallIncrement)} />
                <ToggleButton icon="plus" onPress={() => increment(smallIncrement)} />
                <ToggleButton icon="plus-thick" onPress={() => increment(largeIncrement)} />
            </ToggleButton.Row>
        </View>
    );
}
