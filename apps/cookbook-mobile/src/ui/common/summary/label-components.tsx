import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";
import { ProductIngredient } from "@cookbook/domain/types/position/product-ingredient";
import { View } from "react-native";
import { Divider, Text } from "react-native-paper";
import { styles } from "../../home/recipes/recipe-summary/recipe-summary.style";

export function TotalsRowLabel(props) {
    return <View style={{ flex: 1 }}>
        <Text {...props} variant="bodyLarge" style={styles.positionLabelMargin} />
    </View>;
}

export function PositionRowLabel(props) {
    return <View style={{ flex: 1 }}>
        <Text {...props} style={styles.positionLabelMargin} />
    </View>
}

export function DividedRow({ children }) {
    return <View style={{ width: '100%' }}>
        {children}
        <Divider />
    </View >
}

export function isServedInUnits(ingredient: ProductIngredient) {
    return ingredient.serving.measuring === ProductMeasuring.Units;
}