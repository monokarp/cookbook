import { useInjection } from "inversify-react-native";
import { useContext, useEffect } from "react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { Button, FAB, Text, TextInput } from "react-native-paper";
import { RegexPatterns } from "../../../../constants";
import { PrepackRepository } from "../../../../core/repositories/prepack.repository";
import { ProductsRepository } from "../../../../core/repositories/products.repository";
import { Ingredient } from "../../../../domain/types/recipe/ingredient";
import { FormatNumber, FormatString } from "../../../../domain/util";
import { useUnsub } from "../../../custom-hooks";
import { useProductsStore } from "../../products/products.store";
import { IngredientFormData, IngredientSelect, MapFormDataToIngredient } from "../../recipes/recipe-details/ingredient-select/ingredient-select";
import { usePrepacksStore } from "../prepacks.store";
import { styles } from "./prepack-details.style";
import { Prepack } from "../../../../domain/types/recipe/prepack";
import { PrepackDetailsContext } from "./prepack-details.store";

interface PrepackDetailsFormData {
    name: string,
    finalWeight: string,
    ingredients: IngredientFormData[],
}

export function PrepackDetails({ route, navigation }) {
    const { t } = useTranslation();

    const prepacksRepo = useInjection(PrepackRepository);
    const productsRepo = useInjection(ProductsRepository);
    
    const store = useContext(PrepackDetailsContext);
    const { setPrepack, addIngredient, removeIngredient } = store();
    const prepack = store(state => state.prepack);
    const ingredients = store(state => state.prepack.ingredients);

    const { set: setPrepacks } = usePrepacksStore();
    const { set: setProducts } = useProductsStore();

    const form = useForm({ mode: 'onTouched' });

    useFieldArray({ control: form.control, name: 'ingredients' });

    useUnsub(form.watch, (data: PrepackDetailsFormData) => {
        const updatedPrepack = new Prepack({
            id: prepack.id,
            name: data.name,
            finalWeight: FormatString.Weight(data.finalWeight),
            ingredients: data.ingredients.map((ingredient, index) => MapFormDataToIngredient(ingredient, ingredients[index])),
        });

        setPrepack(updatedPrepack);
    });

    const onSubmit = async () => {
        await prepacksRepo.Save(prepack);

        await prepacksRepo.All().then(setPrepacks);

        navigation.goBack();
    };

    function addEmptyIngredient() {
        addIngredient(Ingredient.Empty());
    };

    function deleteIngredient(index: number) {
        removeIngredient(index);
    };

    useEffect(() => {
        productsRepo.All().then(setProducts);
    }, []);

    return (
        <FormProvider {...form}>
            <View style={styles.container}>
                <View style={{ width: '100%' }}>
                    <Controller
                        defaultValue={prepack.name}
                        rules={{
                            required: true,
                            pattern: RegexPatterns.LatinAndCyrillicText
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label={t('prepack.name')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="name"
                    />
                    {
                        form.formState.errors.recipeName
                        && <Text style={styles.validationErrorLabel}>{t('validation.required.alphanumeric')}</Text>
                    }

                    <Controller
                        defaultValue={FormatNumber.Weight(prepack.finalWeight)}
                        rules={{
                            required: true,
                            validate: (value) => RegexPatterns.Weight.test(value) && Number(value) > 0,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label={t('prepack.finalWeight')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="finalWeight"
                    />
                    {
                        form.formState.errors.finalWeight
                        && <Text style={styles.validationErrorLabel}>{t('validation.required.decimalGTE', { gte: 0 })}</Text>
                    }

                    <Text variant="labelLarge" style={{ margin: 5 }}>
                        {`${t('product.pricing.totalPrice')}: ${FormatNumber.Money(prepack.price())}`}
                    </Text>
                </View>

                <FlatList
                    style={{ flexGrow: 0 }}
                    keyExtractor={(item, index) => index.toString()}
                    data={ingredients}
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