import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";
import { ProductIngredient } from "@cookbook/domain/types/recipe/product-ingredient";
import { Recipe, isPrepackIngredient, isProductIngredient } from "@cookbook/domain/types/recipe/recipe";
import { FormatNumber } from "@cookbook/domain/util";
import { useInjection } from "inversify-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Appbar, Divider, Text, ToggleButton } from "react-native-paper";
import { RecipesRepository } from "../../../../core/repositories/recipes.repository";
import { RootViews } from "../../../root-views.enum";
import { useRecipesStore } from "../recipes.store";
import { RecipeDescription } from "./recipe-description";
import { styles } from "./recipe-summary.style";

export function RecipeSummary({ navigation, route }) {
    const { t } = useTranslation();

    const recipeRepo = useInjection(RecipesRepository);
    const { set: setRecipes } = useRecipesStore();

    const recipe: Recipe = route.params.recipe;

    function isServedInUnits(ingredient: ProductIngredient) {
        return ingredient.serving.measuring === ProductMeasuring.Units;
    }

    const [ratio, setRatio] = useState(1);
    const increment = 0.5;
    const round = num => Number((num).toFixed(1));
    const increaseRatio = () => setRatio(round(ratio + increment));
    const decreaseRatio = () => setRatio(round(ratio - increment ? ratio - increment : ratio));

    const [description, setDescription] = useState(recipe.description);

    const updateDescription = async (value: string) => {
        await recipeRepo.UpdateDescription(recipe.id, value);

        setDescription(value);

        setRecipes(await recipeRepo.All());
    };

    return (
        <View style={{ height: '100%' }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.navigate(RootViews.Home)} />
                <Appbar.Content title={recipe.name} />
                <Appbar.Action icon="file-edit-outline" onPress={() => navigation.navigate(RootViews.RecipeDetails, { recipe: new Recipe({ ...recipe, description }) })} />
            </Appbar.Header>

            <ScrollView>
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

                <View style={styles.bodyCol}>
                    <View style={styles.recipePriceRow}>
                        <TotalsRowLabel>{t('recipe.totals')}</TotalsRowLabel>
                        <TotalsRowLabel>{FormatNumber.Weight(recipe.totalWeight() * ratio)} {t('product.measuring.grams')}</TotalsRowLabel>
                        <TotalsRowLabel>{FormatNumber.Money(recipe.totalPrice() * ratio)}</TotalsRowLabel>
                    </View>
                    <Divider />
                    {
                        recipe.positions.reduce((acc, one, idx) => {
                            if (isPrepackIngredient(one)) {
                                acc.push(<View key={idx * 2} style={styles.positionRow}>
                                    <PositionRowLabel>{one.prepack.name} {t('recipe.details.isPrepack')}</PositionRowLabel>
                                    <PositionRowLabel>{FormatNumber.Weight(one.weightInGrams * ratio)} {t('product.measuring.grams')}</PositionRowLabel>
                                    <PositionRowLabel>{FormatNumber.Money(one.price() * ratio)}</PositionRowLabel>
                                </View>);
                            } else if (isProductIngredient(one)) {
                                acc.push(<View key={idx * 2} style={styles.positionRow}>
                                    <PositionRowLabel>{one.product.name}</PositionRowLabel>
                                    <PositionRowLabel>{(isServedInUnits(one) ? FormatNumber.Units : FormatNumber.Weight)(one.units() * ratio)} {t(isServedInUnits(one) ? 'product.measuring.units' : 'product.measuring.grams')}</PositionRowLabel>
                                    <PositionRowLabel>{FormatNumber.Money(one.price() * ratio)}</PositionRowLabel>
                                </View>);
                            } else {
                                acc.push(<Text style={styles.positionLabelMargin}>Unrecognized position type</Text>);
                            }

                            acc.push(<Divider key={(idx * 2) + 1} />);

                            return acc;
                        }, [])
                    }
                </View>

                <RecipeDescription description={description} onUpdate={updateDescription} />
            </ScrollView>
        </View>
    );
}

function TotalsRowLabel(props) {
    return <View style={{ flex: 1 }}>
        <Text {...props} variant="bodyLarge" style={styles.positionLabelMargin} />
    </View>;
}

function PositionRowLabel(props) {
    return <View style={{ flex: 1 }}>
        <Text {...props} style={styles.positionLabelMargin} />
    </View>
}