import { PrepackIngredient } from "@cookbook/domain/types/position/prepack-ingredient";
import { FormatNumber } from "@cookbook/domain/util";
import { t } from "i18next";
import React from "react";
import { View } from "react-native";
import { Divider, List } from "react-native-paper";
import { styles } from "../../../home/recipes/recipe-summary/recipe-summary.style";
import { DividedRow, TotalsRowLabel } from "../label-components";
import { PositionSummary } from "./position-summary";

export function PrepackPositionSummary(one: PrepackIngredient, ratio: number, key: string) {
    return <View style={{ width: '100%', borderWidth: 1, marginLeft: 2, marginBottom: 1 }}>
        <List.Accordion title={one.prepack.name} description={`${FormatNumber.Weight(one.weightInGrams * ratio)} ${t('product.measuring.grams')}`}>
            {
                [
                    <DividedRow key={`${key}-0`}>
                        <View style={styles.recipePriceRow}>
                            <TotalsRowLabel>{t('recipe.totals')}</TotalsRowLabel>
                            <TotalsRowLabel>{FormatNumber.Weight(one.weightInGrams * ratio)} {t('product.measuring.grams')}</TotalsRowLabel>
                            <TotalsRowLabel>{FormatNumber.Money(one.price() * ratio)}</TotalsRowLabel>
                        </View>
                    </DividedRow>,
                    ...one.prepack.ingredients.map((ingredient, prepackPositionIndex) =>
                        <PositionSummary
                            key={`${key}-${prepackPositionIndex + 1}`}
                            recipePositionKey={`${key}-${prepackPositionIndex + 1}`}
                            position={ingredient}
                            ratio={one.weightRatio() * ratio}
                        />
                    )
                ]
            }
        </List.Accordion>
        <Divider />
    </View>;
};