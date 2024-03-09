import { Position, isPrepackIngredient, isProductIngredient } from "@cookbook/domain/types/position/position";
import { Text } from "react-native-paper";
import { styles } from "../recipe-summary.style";
import { PrepackPositionSummary } from "./prepack-position-summary";
import { ProductPositionSummary } from "./product-position-summary";

export interface PositionSummaryProps {
    position: Position;
    ratio: number;
    recipePositionKey: string;
};

export function PositionSummary({ position, ratio, recipePositionKey }: PositionSummaryProps) {
    if (isPrepackIngredient(position)) {
        return PrepackPositionSummary(position, ratio, recipePositionKey);
    } else if (isProductIngredient(position)) {
        return ProductPositionSummary(position, ratio);
    } else {
        return <Text style={styles.positionLabelMargin}>Unrecognized position type</Text>;
    }
}