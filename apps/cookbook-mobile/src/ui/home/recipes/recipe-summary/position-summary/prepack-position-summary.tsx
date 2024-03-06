import { PrepackIngredient } from "@cookbook/domain/types/position/prepack-ingredient";
import { FormatNumber } from "@cookbook/domain/util";
import { t } from "i18next";
import React from "react";
import { View } from "react-native";
import { Divider, List } from "react-native-paper";
import { DividedRow, PositionRowLabel, TotalsRowLabel } from "../../../../common/summary/label-components";
import { styles } from "../recipe-summary.style";

export function PrepackPositionSummary(one: PrepackIngredient, ratio: number, recipePositionKey: number) {
    const productRatio = num => num * one.weightRatio() * ratio;

    return <View style={{ width: '100%' }}>
        <List.Accordion title={one.prepack.name}>
            {
                [
                    <DividedRow key={`${recipePositionKey}-0`}>
                        <View style={styles.recipePriceRow}>
                            <TotalsRowLabel>{t('recipe.totals')}</TotalsRowLabel>
                            <TotalsRowLabel>{FormatNumber.Weight(one.weightInGrams * ratio)} {t('product.measuring.grams')}</TotalsRowLabel>
                            <TotalsRowLabel>{FormatNumber.Money(one.price() * ratio)}</TotalsRowLabel>
                        </View>
                    </DividedRow>,
                    ...one.prepack.ingredients.map((productIngredient, prepackPositionIndex) =>
                        <DividedRow key={`${recipePositionKey}-${prepackPositionIndex + 1}`}>
                            <View style={styles.positionRow}>
                                <PositionRowLabel>{productIngredient.product.name}</PositionRowLabel>
                                <PositionRowLabel>{FormatNumber.Weight(productRatio(productIngredient.weight()))} {t('product.measuring.grams')}</PositionRowLabel>
                                <PositionRowLabel>{FormatNumber.Money(productRatio(productIngredient.price()))}</PositionRowLabel>
                            </View>
                        </DividedRow>
                    )
                ]
            }
        </List.Accordion>
        <Divider />
    </View>;
};