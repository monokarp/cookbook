
import { RegexPatterns } from "@cookbook/domain/constants";
import { ProductIngredient } from "@cookbook/domain/types/recipe/product-ingredient";
import { Position, Recipe, isPrepackIngredient, isProductIngredient } from "@cookbook/domain/types/recipe/recipe";
import { FormatNumber } from "@cookbook/domain/util";
import { TestIds } from "@cookbook/ui/test-ids";
import { useInjection } from "inversify-react-native";
import { useContext, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FlatList, KeyboardAvoidingView, View } from "react-native";
import { Appbar, FAB, Text, TextInput } from "react-native-paper";
import { RecipesRepository } from "../../../../core/repositories/recipes.repository";
import { IngredientSelect } from "../../../common/ingredient-select/ingredient-select";
import { RootViews } from "../../../root-views.enum";
import { useRecipesStore } from "../recipes.store";
import { RecipeDetailsContext } from "./recipe-details.store";
import { styles } from "./recipe-details.style";


export interface RecipeDetailsFormData {
    recipeName: string
};

export function RecipeDetails({ navigation }) {
    let listElementRef: FlatList<Position> | null = null;

    const { t } = useTranslation();
    const recipeRepo = useInjection(RecipesRepository);

    const store = useContext(RecipeDetailsContext);
    const { addPosition, removePosition, setPosition } = store();
    const recipe = store(state => state.recipe);
    const positions = store(state => state.recipe.positions);

    console.log(`rendering recipe ${recipe.name}`);

    const { set: setRecipes } = useRecipesStore();

    const form = useForm({
        defaultValues: {
            recipeName: recipe.name,
        }
    });

    const [currentlyEditedItemIndex, setCurrentlyEditedItemIndex] = useState<number | null>(null);

    const onSubmit = async (data: RecipeDetailsFormData) => {
        const updatedRecipe = new Recipe({ ...recipe, name: data.recipeName });

        await recipeRepo.Save(updatedRecipe);

        await recipeRepo.All().then(setRecipes);

        navigation.navigate(RootViews.RecipeSummary, { recipe: updatedRecipe });
    };

    function addEmptyIngredient() {
        addPosition(ProductIngredient.Empty());
        setCurrentlyEditedItemIndex(recipe.positions.length);
        if (recipe.positions.length) {
            listElementRef.scrollToIndex({ index: recipe.positions.length - 1 });
        }
    };

    function deleteIngredient(index: number) {
        removePosition(index);
        setCurrentlyEditedItemIndex(null);
    };

    return (
        <FormProvider {...form}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={t('recipe.details.title')} />
                <Appbar.Action icon="check-bold" onPress={form.handleSubmit(onSubmit)} />
            </Appbar.Header>
            <KeyboardAvoidingView style={styles.container}>
                <FlatList
                    ref={ref => listElementRef = ref}
                    style={{ flexGrow: 0, width: '100%' }}
                    keyExtractor={(item, index) => {
                        if (isProductIngredient(item)) {
                            return `${index}_${item.product.id}`;
                        }

                        if (isPrepackIngredient(item)) {
                            return `${index}_${item.prepack.id}`;
                        }

                        return index.toString();
                    }}
                    ListHeaderComponent={() =>
                        <View style={{ flexDirection: 'row' }}>

                            <View style={{ flex: 4 }}>
                                <Controller
                                    name="recipeName"
                                    rules={{
                                        required: true,
                                        pattern: RegexPatterns.EntityName
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View>
                                            <TextInput
                                                testID={TestIds.RecipeDetails.NameInput}
                                                placeholder={t('recipe.name')}
                                                style={styles.input}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        </View>
                                    )}
                                />
                                {
                                    form.formState.errors.recipeName &&
                                    <Text style={styles.validationErrorLabel}>{t('validation.required.alphanumeric')}</Text>
                                }
                                <Text testID={TestIds.RecipeDetails.NameInputError} variant="labelLarge" style={{ margin: 5 }}>
                                    {`${t('product.pricing.totalPrice')}: ${FormatNumber.Money(recipe.totalPrice())}`}
                                </Text>

                            </View>
                        </View>
                    }
                    data={positions}
                    renderItem={({ item, index }) =>
                        <IngredientSelect
                            allowAddingPrepacks={true}
                            ingredient={item}
                            index={index}
                            isEditing={currentlyEditedItemIndex === index}
                            requestEdit={() => {
                                setCurrentlyEditedItemIndex(index)
                            }}
                            onEditConfirmed={(position) => {
                                console.log('position edit confirmed', position)
                                setPosition(position, index);
                                setCurrentlyEditedItemIndex(null);
                            }}
                            onDelete={() => {
                                deleteIngredient(index);
                            }}
                        />
                    }
                    ListFooterComponentStyle={{ justifyContent: 'center' }}
                    ListFooterComponent={() =>
                        <FAB
                            testID={TestIds.RecipeDetails.AddIngredient}
                            disabled={currentlyEditedItemIndex !== null}
                            icon="plus"
                            style={{ margin: 10, alignSelf: 'center' }}
                            onPress={addEmptyIngredient}
                        />
                    }
                />
            </KeyboardAvoidingView>
        </FormProvider>
    );
}