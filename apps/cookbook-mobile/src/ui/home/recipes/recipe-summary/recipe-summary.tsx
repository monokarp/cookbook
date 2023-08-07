import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";
import { ProductIngredient } from "@cookbook/domain/types/recipe/product-ingredient";
import { Recipe, isPrepackIngredient, isProductIngredient } from "@cookbook/domain/types/recipe/recipe";
import { FormatNumber } from "@cookbook/domain/util";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Appbar, Text, ToggleButton } from "react-native-paper";
import { RootViews } from "../../../root-views.enum";
import { styles } from "./recipe-summary.style";

export function RecipeSummary({ navigation, route }) {
    const { t } = useTranslation();

    const recipe: Recipe = route.params.recipe;

    function isServedInUnits(ingredient: ProductIngredient) {
        return ingredient.serving.measuring === ProductMeasuring.Units;
    }

    const [ratio, setRatio] = useState(1);
    const increment = 0.5;
    const round = num => Number((num).toFixed(1));
    const increaseRatio = () => setRatio(round(ratio + increment));
    const decreaseRatio = () => setRatio(round(ratio - increment ? ratio - increment : ratio));

    return (
        <View>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.navigate(RootViews.Home)} />
                <Appbar.Content title={recipe.name} />
                <Appbar.Action icon="file-edit-outline" onPress={() => navigation.navigate(RootViews.RecipeDetails, { recipe })} />
            </Appbar.Header>

            <View style={styles.bodyCol}>
                <View style={styles.recipePriceRow}>
                    <View style={{ flex: 2 }}>
                        <PriceRowLabel>{t('product.pricing.totalPrice')}</PriceRowLabel>
                    </View>
                    <View style={{ flex: 1 }}>
                        <PriceRowLabel>{FormatNumber.Money(recipe.totalPrice() * ratio)}</PriceRowLabel>
                    </View>
                </View>
                {
                    recipe.positions.map((one, idx) => {
                        if (isPrepackIngredient(one)) {
                            return <View key={idx} style={styles.positionRow}>
                                <PositionRowLabel>{one.prepack.name} {t('recipe.details.isPrepack')}</PositionRowLabel>
                                <PositionRowLabel>{FormatNumber.Weight(one.weightInGrams * ratio)} {t('product.measuring.grams')}</PositionRowLabel>
                                <PositionRowLabel>{FormatNumber.Money(one.price() * ratio)}</PositionRowLabel>
                            </View>;
                        }

                        if (isProductIngredient(one)) {
                            return <View key={idx} style={styles.positionRow}>
                                <PositionRowLabel>{one.product.name}</PositionRowLabel>
                                <PositionRowLabel>{(isServedInUnits(one) ? FormatNumber.Units : FormatNumber.Weight)(one.units() * ratio)} {t(isServedInUnits(one) ? 'product.measuring.units' : 'product.measuring.grams')}</PositionRowLabel>
                                <PositionRowLabel>{FormatNumber.Money(one.price() * ratio)}</PositionRowLabel>
                            </View>;
                        }

                        return <Text style={styles.positionLabelMargin}>Unrecognized position type</Text>
                    })
                }

                <View style={styles.ratioBoxContainer}>
                    <Text style={styles.ratioLabel} variant="headlineSmall">{ratio}</Text>
                    {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
                    <ToggleButton.Row style={{ margin: 10 }} onValueChange={() => { }} value="">
                        <ToggleButton
                            icon="minus"
                            onPress={decreaseRatio}
                        />
                        <ToggleButton
                            icon="plus"
                            onPress={increaseRatio}
                        />
                    </ToggleButton.Row>
                </View>
            </View>
        </View>
    );
}

function PriceRowLabel(props) {
    return <Text {...props} variant="bodyLarge" style={styles.positionLabelMargin} />
}

function PositionRowLabel(props) {
    return <View style={{ flex: 1 }}>
        <Text {...props} style={styles.positionLabelMargin} />
    </View>
}