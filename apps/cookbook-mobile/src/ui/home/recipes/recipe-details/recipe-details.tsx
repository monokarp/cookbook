
import { useInjection } from "inversify-react-native";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { Button, FAB, Text, TextInput } from "react-native-paper";
import { RegexPatterns } from "../../../../constants";
import { ProductsRepository } from "../../../../core/repositories/products.repository";
import { RecipesRepository } from "../../../../core/repositories/recipes.repository";
import { ProductMeasuring } from "../../../../domain/types/product/product-pricing";
import { ProductIngredient } from "../../../../domain/types/recipe/product-ingredient";
import { Recipe, isPrepackIngredient, isProductIngredient } from "../../../../domain/types/recipe/recipe";
import { FormatNumber } from "../../../../domain/util";
import { useUnsub } from "../../../custom-hooks";
import { useProductsStore } from "../../products/products.store";
import { useRecipesStore } from "../recipes.store";
import { styles } from "./recipe-details.style";
import { IngredientFormData, IngredientSelect, MapFormDataToIngredient } from "./ingredient-select/ingredient-select";


export interface RecipeDetailsFormData {
    recipeName: string,
    ingredients: IngredientFormData[],
};

export function RecipeDetails({ route, navigation }) {
    const { t } = useTranslation();
    const recipeRepo = useInjection(RecipesRepository);
    const productsRepo = useInjection(ProductsRepository);

    const [recipe, setRecipe] = useState(route.params.recipe);

    const { set: setRecipes } = useRecipesStore();
    const { set: setProducts } = useProductsStore();

    const form = useForm({
        mode: 'onTouched',
        defaultValues: {
            recipeName: recipe.name,
            ingredients: recipe.positions.map(position => {
                if (isProductIngredient(position)) {
                    return {
                        selectedItem: position.product,
                        units: position.serving.measuring === ProductMeasuring.Units
                            ? FormatNumber.Units(position.serving.units)
                            : FormatNumber.Weight(position.serving.units),
                        measuringType: position.serving.measuring,
                    };
                }

                if (isPrepackIngredient(position)) {
                    return {
                        selectedItem: position.prepack,
                        units: FormatNumber.Weight(position.weightInGrams),
                        measuringType: ProductMeasuring.Grams,
                    };
                }

                throw new Error('Unknown ingredient type');
            })
        }
    });

    const { remove } = useFieldArray({ control: form.control, name: 'ingredients' });

    useUnsub(form.watch, (data: RecipeDetailsFormData) => {
        const updatedRecipe = new Recipe({
            id: recipe.id,
            name: data.recipeName,
            positions: data.ingredients.map((ingredient, index) => MapFormDataToIngredient(ingredient)),
        });

        setRecipe(updatedRecipe);
    });

    const onSubmit = async () => {
        await recipeRepo.Save(recipe);

        await recipeRepo.All().then(setRecipes);

        navigation.goBack();
    };

    function addEmptyIngredient() {
        setRecipe(new Recipe({
            ...recipe,
            positions: [
                ...recipe.positions,
                ProductIngredient.Empty()
            ]
        }));
    };

    function deleteIngredient(index: number) {
        remove(index);
        setRecipe(new Recipe({
            ...recipe,
            positions: recipe.positions.filter((_, i) => i !== index)
        }));
    };

    useEffect(() => {
        productsRepo.All().then(setProducts);
    }, []);

    return (
        <FormProvider {...form}>
            <View style={styles.container}>
                <View style={{ width: '100%' }}>
                    <Controller
                        defaultValue={recipe.name}
                        rules={{
                            required: true,
                            pattern: RegexPatterns.LatinAndCyrillicText
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label={t('recipe.name')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="recipeName"
                    />
                    {form.formState.errors.recipeName && <Text style={styles.validationErrorLabel}>{t('validation.required.alphanumeric')}</Text>}
                    <Text variant="labelLarge" style={{ margin: 5 }}>
                        {`${t('product.pricing.totalPrice')}: ${FormatNumber.Money(recipe.totalPrice())}`}
                    </Text>
                </View>

                <FlatList
                    style={{ flexGrow: 0 }}
                    keyExtractor={(item, index) => {
                        if (isProductIngredient(item)) {
                            return `${index}_${item.product.id}`;
                        }

                        if (isPrepackIngredient(item)) {
                            return `${index}_${item.prepack.id}`;
                        }

                        return index.toString();
                    }}
                    data={recipe.positions}
                    renderItem={({ item, index }) =>
                        <IngredientSelect
                            selectedIngredient={item}
                            index={index}
                            requestRemoval={() => deleteIngredient(index)}
                        />
                    }
                />

                <FAB
                    icon="plus"
                    style={{ marginTop: 10 }}
                    onPress={addEmptyIngredient}
                />

                <Button style={{ marginTop: 'auto', marginBottom: 15 }} mode="outlined" onPress={form.handleSubmit(onSubmit)}>{t('common.save')}</Button>
            </View>
        </FormProvider>
    );
}