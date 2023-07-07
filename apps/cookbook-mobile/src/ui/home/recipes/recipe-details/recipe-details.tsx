
import { useInjection } from "inversify-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { Button, FAB, Text, TextInput } from "react-native-paper";
import { RegexPatterns } from "../../../../constants";
import { ProductsRepository } from "../../../../core/repositories/products.repository";
import { RecipesRepository } from "../../../../core/repositories/recipes.repository";
import { ProductMeasuring } from "../../../../domain/types/product/product-pricing";
import { Ingridient } from "../../../../domain/types/recipe/ingridient";
import { Recipe } from "../../../../domain/types/recipe/recipe";
import { FormatNumber } from "../../../../domain/util";
import { useProductsStore } from "../../products/products.store";
import { useRecipesStore } from "../recipes.store";
import { IngridientSelect } from "./ingridient-select/ingridient-select";
import { styles } from "./recipe-details.style";
import { Product } from "../../../../domain/types/product/product";

export function RecipeDetails({ route, navigation }) {
    const { t } = useTranslation();
    const recipeRepo = useInjection(RecipesRepository);
    const productsRepo = useInjection(ProductsRepository);

    const [recipe, setRecipe] = useState(route.params.recipe);

    const { setRecipes } = useRecipesStore();
    const { products, setProducts } = useProductsStore();

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            recipeName: recipe.name,
        },
        mode: 'onChange'
    });

    const onSubmit = async (data) => {
        await recipeRepo.Save(
            new Recipe({
                id: recipe.id,
                name: data.recipeName,
                positions: recipe.positions
            })
        );

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

    function onIngridientSelect(value: Ingridient, index: number) {
        const updatedPositions = [...recipe.positions];

        if (recipe.positions[index]) {
            updatedPositions[index] = value;
        } else {
            updatedPositions.push(value);
        }

        setRecipe(new Recipe({
            ...recipe,
            positions: updatedPositions
        }));
    }

    useEffect(() => {
        productsRepo.All().then(setProducts);
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ width: '100%' }}>
                <Controller
                    control={control}
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
                {errors.recipeName && <Text style={styles.validationErrorLabel}>{t('validation.required.aplhanumeric')}</Text>}
                <Text variant="labelLarge" style={{ margin: 5 }}>
                    {`${t('product.pricing.totalPrice')}: ${FormatNumber.Money(recipe.totalPrice())}`}
                </Text>
            </View>

            <FlatList
                style={{ flexGrow: 0 }}
                data={recipe.positions}
                renderItem={({ item, index }) =>
                    <IngridientSelect
                        selectedIngridient={item}
                        onChange={(value) => onIngridientSelect(value, index)}
                    />
                }
            />

            <FAB
                icon="plus"
                style={{ marginTop: 10 }}
                onPress={addEmptyIngridient}
            />

            <Button style={{ marginTop: 'auto', marginBottom: 15 }} mode="outlined" onPress={handleSubmit(onSubmit)}>{t('common.save')}</Button>
        </View>
    );
}