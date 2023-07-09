
import { useInjection } from "inversify-react-native";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { Button, FAB, Text, TextInput } from "react-native-paper";
import { RegexPatterns } from "../../../../constants";
import { ProductsRepository } from "../../../../core/repositories/products.repository";
import { RecipesRepository } from "../../../../core/repositories/recipes.repository";
import { Product } from "../../../../domain/types/product/product";
import { ProductMeasuring } from "../../../../domain/types/product/product-pricing";
import { Ingridient } from "../../../../domain/types/recipe/ingridient";
import { Recipe } from "../../../../domain/types/recipe/recipe";
import { FormatNumber } from "../../../../domain/util";
import { useUnsub } from "../../../custom-hooks";
import { useProductsStore } from "../../products/products.store";
import { useRecipesStore } from "../recipes.store";
import { IngridientFormData, IngridientSelect, MapFormDataToIngridient } from "./ingridient-select/ingridient-select";
import { styles } from "./recipe-details.style";


export interface RecipeDetailsFormData {
    recipeName: string,
    ingridients: IngridientFormData[],
};

export function RecipeDetails({ route, navigation }) {
    const { t } = useTranslation();
    const recipeRepo = useInjection(RecipesRepository);
    const productsRepo = useInjection(ProductsRepository);

    const [recipe, setRecipe] = useState(route.params.recipe);

    const { setRecipes } = useRecipesStore();
    const { setProducts } = useProductsStore();

    const form = useForm({ mode: 'onTouched' });

    useFieldArray({ control: form.control, name: 'ingridients' });

    useUnsub(form.watch, (data: RecipeDetailsFormData) => {
        const updatedRecipe = new Recipe({
            id: recipe.id,
            name: data.recipeName,
            positions: data.ingridients.map((ingridient, index) => MapFormDataToIngridient(ingridient, recipe.positions[index])),
        });

        setRecipe(updatedRecipe);
    });

    const onSubmit = async () => {
        await recipeRepo.Save(recipe);

        await recipeRepo.All().then(setRecipes);

        navigation.goBack();
    };

    function addEmptyIngridient() {
        setRecipe(new Recipe({
            ...recipe,
            positions: [
                ...recipe.positions,
                new Ingridient({
                    product: new Product({
                        id: '',
                        name: t('validation.required.selectProduct'),
                        pricing: {
                            measuring: ProductMeasuring.Grams,
                            price: 0,
                            weightInGrams: 1,
                            numberOfUnits: 1,
                        }
                    }),
                    serving: { units: 0, measuring: ProductMeasuring.Grams }
                })
            ]
        }));
    };

    function deleteIngridient(index: number) {
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
                    {form.formState.errors.recipeName && <Text style={styles.validationErrorLabel}>{t('validation.required.aplhanumeric')}</Text>}
                    <Text variant="labelLarge" style={{ margin: 5 }}>
                        {`${t('product.pricing.totalPrice')}: ${FormatNumber.Money(recipe.totalPrice())}`}
                    </Text>
                </View>

                <FlatList
                    style={{ flexGrow: 0 }}
                    keyExtractor={(item, index) => index.toString()}
                    data={recipe.positions}
                    renderItem={({ item, index }) =>
                        <IngridientSelect
                            selectedIngridient={item}
                            index={index}
                            requestRemoval={() => deleteIngridient(index)}
                        />
                    }
                />

                <FAB
                    icon="plus"
                    style={{ marginTop: 10 }}
                    onPress={addEmptyIngridient}
                />

                <Button style={{ marginTop: 'auto', marginBottom: 15 }} mode="outlined" onPress={form.handleSubmit(onSubmit)}>{t('common.save')}</Button>
            </View>
        </FormProvider>
    );
}