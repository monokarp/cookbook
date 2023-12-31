import { ProductIngredient } from "@cookbook/domain/types/recipe/product-ingredient";
import { FormatNumber } from "@cookbook/domain/util";
import { t } from "i18next";
import { View } from "react-native";
import { DividedRow, PositionRowLabel, isServedInUnits } from "../../../../common/summary/label-components";
import { styles } from "../recipe-summary.style";

export function ProductPositionSummary(one: ProductIngredient, ratio: number) {
    return <DividedRow>
        <View style={styles.positionRow}>
            <PositionRowLabel>{one.product.name}</PositionRowLabel>
            <PositionRowLabel>{(isServedInUnits(one) ? FormatNumber.Units : FormatNumber.Weight)(one.units() * ratio)} {t(isServedInUnits(one) ? 'product.measuring.units' : 'product.measuring.grams')}</PositionRowLabel>
            <PositionRowLabel>{FormatNumber.Money(one.price() * ratio)}</PositionRowLabel>
        </View>
    </DividedRow>;
};