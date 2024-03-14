import { Recipe } from "@cookbook/domain/types/recipe/recipe";
import { FormatNumber } from "@cookbook/domain/util";
import { TestIds } from "@cookbook/ui/test-ids";
import { useInjection } from "inversify-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Appbar, Divider } from "react-native-paper";
import { Recipes } from "../../../../core/models/recipes";
import { IngredientRatio } from "../../../common/summary/ingredient-ratio/ingredient-ratio";
import { PositionRowLabel, TotalsRowLabel } from "../../../common/summary/label-components";
import { PositionSummary } from "../../../common/summary/position-summary/position-summary";
import { RootViews } from "../../../root-views.enum";
import { GroupRowWrapper } from "../recipe-details/group-wrapper/group-wrapper";
import { useRecipesStore } from "../recipes.store";
import { RecipeDescription } from "./recipe-description";
import { styles } from "./recipe-summary.style";

export function RecipeSummary({ navigation, route }) {
    const { t } = useTranslation();

    const recipeRepo = useInjection(Recipes);
    const { set: setRecipes } = useRecipesStore();

    const recipe: Recipe = route.params.recipe;

    const macros = recipe.macros();
    const kcal = (macros.carbs + macros.prot) * 4 + macros.fat * 9;

    const [portions, setPortions] = useState(0);
    const [ratio, setRatio] = useState(0);

    const [description, setDescription] = useState('');

    const updateDescription = async (value: string) => {
        await recipeRepo.UpdateDescription(recipe.id, value);

        setDescription(value);

        setRecipes(await recipeRepo.All());
    };

    useEffect(() => {
        setPortions(recipe.portions);
        setDescription(recipe.description);
    }, [recipe]);

    useEffect(() => {
        setRatio(portions / recipe.portions);
    }, [recipe, portions]);

    return (
        <View style={{ height: '100%' }}>
            <Appbar.Header>
                <Appbar.BackAction testID={TestIds.RecipeSummary.Back} onPress={() => navigation.navigate(RootViews.Home)} />
                <Appbar.Content title={recipe.name} />
                <Appbar.Action testID={TestIds.RecipeSummary.ToDetails} icon="file-edit-outline"
                    onPress={() => {
                        recipe.description = description;

                        navigation.navigate(RootViews.RecipeDetails, { recipe: recipe.clone() });
                    }}
                />
            </Appbar.Header>

            <ScrollView>
                <IngredientRatio value={portions} onChange={setPortions} />

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
                                <PositionSummary position={one} ratio={ratio} recipePositionKey={`${recipePositionIndex * 2}`} />
                            </GroupRowWrapper>
                        )
                    }
                </View>

                <View style={{ ...styles.bodyCol, padding: 5, paddingTop: 15 }}>
                    <View style={styles.recipePriceRow}>
                        <PositionRowLabel>{t('product.details.carbs')}</PositionRowLabel>
                        <PositionRowLabel>{t('product.details.prot')}</PositionRowLabel>
                        <PositionRowLabel>{t('product.details.fat')}</PositionRowLabel>
                        <PositionRowLabel>{t('product.details.kcal')}</PositionRowLabel>
                    </View>
                    <Divider />
                    <View style={styles.recipePriceRow}>
                        <MacrosValueLabel value={macros.carbs * ratio} />
                        <MacrosValueLabel value={macros.prot * ratio} />
                        <MacrosValueLabel value={macros.fat * ratio} />
                        <MacrosValueLabel value={kcal * ratio} />
                    </View>
                </View>

                <RecipeDescription description={description} onUpdate={updateDescription} />
            </ScrollView>
        </View>
    );
}

export function MacrosValueLabel(props: { value: number }) {
    return <PositionRowLabel>{FormatNumber.Money(props.value)}</PositionRowLabel>;
}
