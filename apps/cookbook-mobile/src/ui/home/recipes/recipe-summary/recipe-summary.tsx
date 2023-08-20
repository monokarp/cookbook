import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";
import { PrepackIngredient } from "@cookbook/domain/types/recipe/prepack-ingredient";
import { ProductIngredient } from "@cookbook/domain/types/recipe/product-ingredient";
import { Position, Recipe, isPrepackIngredient, isProductIngredient } from "@cookbook/domain/types/recipe/recipe";
import { FormatNumber } from "@cookbook/domain/util";
import { useInjection } from "inversify-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Appbar, Divider, List, Text, ToggleButton } from "react-native-paper";
import { RecipesRepository } from "../../../../core/repositories/recipes.repository";
import { RootViews } from "../../../root-views.enum";
import { GroupRowWrapper } from "../recipe-details/group-wrapper/group-wrapper";
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


    const GetPositionNode = (one: Position, recipePositionIndex: number) => {
        if (isPrepackIngredient(one)) {
            return GetPrepackNode(one, recipePositionIndex);
        } else if (isProductIngredient(one)) {
            return GetProductNode(one);
        } else {
            return <Text style={styles.positionLabelMargin}>Unrecognized position type</Text>;
        }
    }

    const GetPrepackNode = (one: PrepackIngredient, recipePositionIndex: number) => {
        const prepackWeightRatio = one.prepack.ingredients.reduce((acc, next) => acc + next.weight(), 0) / one.prepack.finalWeight;

        return <View style={{ width: '100%' }}>
            <List.Accordion title={one.prepack.name}>
                {
                    [
                        <DividedRow key={`${recipePositionIndex}-0`}>
                            <View style={styles.recipePriceRow}>
                                <TotalsRowLabel>{t('recipe.totals')}</TotalsRowLabel>
                                <TotalsRowLabel>{FormatNumber.Weight(one.weightInGrams * ratio)} {t('product.measuring.grams')}</TotalsRowLabel>
                                <TotalsRowLabel>{FormatNumber.Money(one.price() * ratio)}</TotalsRowLabel>
                            </View>
                        </DividedRow>,
                        ...one.prepack.ingredients.map((productIngredient, prepackPositionIndex) =>
                            <DividedRow key={`${recipePositionIndex}-${prepackPositionIndex + 1}`}>
                                <View style={styles.positionRow}>
                                    <PositionRowLabel>{productIngredient.product.name}</PositionRowLabel>
                                    <PositionRowLabel>{FormatNumber.Weight(productIngredient.weight() * prepackWeightRatio * ratio)} {t('product.measuring.grams')}</PositionRowLabel>
                                    <PositionRowLabel>{FormatNumber.Money(productIngredient.price() * prepackWeightRatio * ratio)}</PositionRowLabel>
                                </View>
                            </DividedRow>
                        )
                    ]
                }
            </List.Accordion>
            <Divider />
        </View>;
    };

    const GetProductNode = (one: ProductIngredient) => {
        return <DividedRow>
            <View style={styles.positionRow}>
                <PositionRowLabel>{one.product.name}</PositionRowLabel>
                <PositionRowLabel>{(isServedInUnits(one) ? FormatNumber.Units : FormatNumber.Weight)(one.units() * ratio)} {t(isServedInUnits(one) ? 'product.measuring.units' : 'product.measuring.grams')}</PositionRowLabel>
                <PositionRowLabel>{FormatNumber.Money(one.price() * ratio)}</PositionRowLabel>
            </View>
        </DividedRow>;
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
                        recipe.positions.map((one, recipePositionIndex) =>
                            <GroupRowWrapper key={(recipePositionIndex * 2)} recipeGroups={recipe.groups} rowIndex={recipePositionIndex}>
                                {GetPositionNode(one, recipePositionIndex * 2)}
                            </GroupRowWrapper>
                        )
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

function DividedRow({ children }) {
    return <View style={{ width: '100%' }}>
        {children}
        <Divider />
    </View >
}