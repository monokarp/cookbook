
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
import { FAB, Text, TextInput } from "react-native-paper";
import { RecipesRepository } from "../../../../core/repositories/recipes.repository";
import { IngredientSelect } from "../../../common/ingredient-select/ingredient-select";
import { useRecipesStore } from "../recipes.store";
import { RecipeDetailsContext } from "./recipe-details.store";
import { styles } from "./recipe-details.style";


export interface RecipeDetailsFormData {
    name: string
};

export function RecipeDetails({ navigation }) {
    let listElementRef: FlatList<Position> | null = null;

    const { t } = useTranslation();
    const recipeRepo = useInjection(RecipesRepository);


    const store = useContext(RecipeDetailsContext);
    const { addPosition, removePosition, setPosition } = store();
    const recipe = store(state => state.recipe);
    const positions = store(state => state.recipe.positions);

    console.log('rendering recipe', JSON.stringify(recipe));

    const { set: setRecipes } = useRecipesStore();

    const form = useForm({
        defaultValues: {
            recipeName: recipe.name,
        }
    });

    const [currentlyEditedItemIndex, setCurrentlyEditedItemIndex] = useState<number | null>(null);

    const onSubmit = async (data: RecipeDetailsFormData) => {
        console.log('saving recipe', JSON.stringify(recipe));

        await recipeRepo.Save(new Recipe({ ...recipe, name: data.name }));

        await recipeRepo.All().then(setRecipes);

        navigation.goBack();
    };

    function addEmptyIngredient() {
        addPosition(ProductIngredient.Empty());
        setCurrentlyEditedItemIndex(recipe.positions.length);
    };

    function deleteIngredient(index: number) {
        removePosition(index);
        setCurrentlyEditedItemIndex(null);
    };

    return (
        <FormProvider {...form}>
            <KeyboardAvoidingView style={styles.container}>
                <FlatList
                    ref={ref => listElementRef = ref}
                    onContentSizeChange={() => { if (recipe.positions.length) listElementRef.scrollToEnd() }}
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
                                    name="name"
                                    defaultValue={recipe.name}
                                    rules={{
                                        required: true,
                                        pattern: RegexPatterns.EntityName
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            testID={TestIds.RecipeDetails.NameInput}
                                            label={t('recipe.name')}
                                            style={styles.input}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
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

                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent:'space-evenly' }}>
                                <FAB
                                    testID={TestIds.RecipeDetails.Submit}
                                    disabled={currentlyEditedItemIndex !== null}
                                    icon="check-bold"
                                    style={{ margin: 15 }}
                                    onPress={form.handleSubmit(onSubmit)}
                                />

                                <FAB
                                    testID={TestIds.RecipeDetails.AddIngredient}
                                    disabled={currentlyEditedItemIndex !== null}
                                    icon="plus"
                                    style={{ margin: 15 }}
                                    onPress={addEmptyIngredient}
                                />
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
                />
            </KeyboardAvoidingView>
        </FormProvider>
    );
}