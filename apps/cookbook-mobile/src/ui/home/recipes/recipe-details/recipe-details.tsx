
import { ProductsRepository } from "apps/cookbook-mobile/src/core/repositories/products.repository";
import { RecipesRepository } from "apps/cookbook-mobile/src/core/repositories/recipes.repository";
import { Ingridient } from "apps/cookbook-mobile/src/domain/types/recipe/ingridient";
import { Recipe } from "apps/cookbook-mobile/src/domain/types/recipe/recipe";
import { useInjection } from "inversify-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { Button, FAB, Text, TextInput } from "react-native-paper";
import { useProductsStore } from "../../products/products.store";
import { useRecipesStore } from "../recipes.store";
import { IngridientSelect } from "./ingridient-select/ingridient-select";
import { styles } from "./recipe-details.style";
import { RegexPatterns } from "apps/cookbook-mobile/src/constants";

export function RecipeDetails({ route, navigation }) {
    const recipe: Recipe = route.params.recipe;

    const [ingridients, setIngridients] = useState(recipe.positions);

    const recipeRepo = useInjection(RecipesRepository);
    const productsRepo = useInjection(ProductsRepository);

    const { t } = useTranslation();

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
                positions: ingridients
            })
        );

        await recipeRepo.All().then(setRecipes);

        navigation.goBack();
    };

    function addNewIngridient() {
        setIngridients([...ingridients, new Ingridient({ product: products[0], unitsPerServing: 0 })]);
    }

    function onIngridientSelect(value: Ingridient, index: number) {
        if (ingridients[index]) {
            ingridients[index] = value;
            setIngridients(ingridients);
        } else {
            setIngridients([...ingridients, value]);
        }
    }

    useEffect(() => {
        productsRepo.All().then(setProducts);
    }, [productsRepo, setProducts]);

    return (
        <View style={styles.container}>
            <View style={{ width: '100%' }}>
                {/* Product name */}
                <Text style={styles.inputLabel}>{t('recipe.name')}</Text>
                <Controller
                    control={control}
                    rules={{
                        required: true,
                        pattern: RegexPatterns.LatinAndCyrillicText
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="recipeName"
                />
                {errors.recipeName && <Text style={styles.validationErrorLabel}>{t('validation.required.aplhanumeric')}</Text>}
            </View>

            <FlatList
                style={{ flexGrow: 0 }}
                data={ingridients}
                renderItem={({ item, index }) =>
                    <IngridientSelect
                        selectedIngridient={item}
                        onChange={(value) => onIngridientSelect(value, index)}
                    />
                }
            />

            <FAB
                icon="plus"
                onPress={addNewIngridient}
            />

            <Button style={{ marginTop: 'auto' }} mode="outlined" onPress={handleSubmit(onSubmit)}>{t('common.save')}</Button>
        </View>
    );
}