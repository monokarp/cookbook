import { RegexPatterns } from "@cookbook/domain/constants";
import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";
import { Prepack } from "@cookbook/domain/types/recipe/prepack";
import { ProductIngredient } from "@cookbook/domain/types/recipe/product-ingredient";
import { FormatNumber, FormatString } from "@cookbook/domain/util";
import { useInjection } from "inversify-react-native";
import { useContext, useEffect } from "react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { Button, FAB, Text, TextInput } from "react-native-paper";
import { PrepackRepository } from "../../../../core/repositories/prepack.repository";
import { ProductsRepository } from "../../../../core/repositories/products.repository";
import { useSubscription } from "../../../custom-hooks";
import { useKeyboardVisible } from "../../common/use-kb-visible";
import { useProductsStore } from "../../products/products.store";
import { IngredientFormData, IngredientSelect, MapFormDataToIngredient } from "../../recipes/recipe-details/ingredient-select/ingredient-select";
import { usePrepacksStore } from "../prepacks.store";
import { PrepackDetailsContext } from "./prepack-details.store";
import { styles } from "./prepack-details.style";
import { TestIds } from "@cookbook/ui/test-ids.enum";

interface PrepackDetailsFormData {
    name: string,
    finalWeight: string,
    ingredients: IngredientFormData[],
}

export function PrepackDetails({ navigation }) {
    const { t } = useTranslation();

    const prepacksRepo = useInjection(PrepackRepository);
    const productsRepo = useInjection(ProductsRepository);

    const store = useContext(PrepackDetailsContext);
    const { setPrepack, addIngredient, removeIngredient } = store();
    const prepack = store(state => state.prepack);
    const ingredients = store(state => state.prepack.ingredients);

    const { set: setPrepacks } = usePrepacksStore();
    const { set: setProducts } = useProductsStore();

    const isKbVisible = useKeyboardVisible();

    const form = useForm({
        defaultValues: {
            name: prepack.name,
            finalWeight: prepack.finalWeight ? FormatNumber.Weight(prepack.finalWeight) : '',
            ingredients: prepack.ingredients.map(ingredient => {
                return {
                    selectedItem: ingredient.product,
                    units: ingredient.serving.measuring === ProductMeasuring.Units
                        ? FormatNumber.Units(ingredient.serving.units)
                        : FormatNumber.Weight(ingredient.serving.units),
                    measuringType: ingredient.serving.measuring,
                };
            })
        }
    });

    const { remove } = useFieldArray({ control: form.control, name: 'ingredients' });

    useSubscription(form.watch, (data: PrepackDetailsFormData) => {
        const updatedPrepack = new Prepack({
            id: prepack.id,
            name: data.name,
            finalWeight: FormatString.Weight(data.finalWeight),
            ingredients: data.ingredients.map((ingredient, index) => MapFormDataToIngredient(ingredient) as ProductIngredient),
        });

        setPrepack(updatedPrepack);
    });

    const onSubmit = async () => {
        await prepacksRepo.Save(prepack);

        await prepacksRepo.All().then(setPrepacks);

        navigation.goBack();
    };

    function addEmptyIngredient() {
        addIngredient(ProductIngredient.Empty());
    };

    function deleteIngredient(index: number) {
        remove(index);
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
                        rules={{
                            required: true,
                            pattern: RegexPatterns.LatinAndCyrillicText
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                testID={TestIds.PrepackDetails.NameInput}
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
                        form.formState.errors.name
                        && <Text style={styles.validationErrorLabel}>{t('validation.required.alphanumeric')}</Text>
                    }

                    <Controller
                        rules={{
                            validate: (value) => {
                                const isValidWeight = RegexPatterns.Weight.test(value) && Number(value) > 0;

                                return prepack.ingredients.length
                                    ? isValidWeight
                                    : isValidWeight || value === '';
                            },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                testID={TestIds.PrepackDetails.WeightInput}
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
                    keyExtractor={(item, index) => `${index}_${item.product.id}`}
                    data={ingredients}
                    renderItem={({ item, index }) =>
                        <IngredientSelect
                            allowAddingPrepacks={false}
                            selectedIngredient={item}
                            index={index}
                            requestRemoval={() => deleteIngredient(index)}
                        />
                    }
                />

                <FAB
                    testID={TestIds.PrepackDetails.AddIngredient}
                    visible={!isKbVisible}
                    icon="plus"
                    style={{ marginTop: 10 }}
                    onPress={addEmptyIngredient}
                />

                {
                    !isKbVisible &&
                    <Button
                        testID={TestIds.PrepackDetails.Submit}
                        style={{ marginTop: 'auto', marginBottom: 15 }}
                        mode="outlined"
                        onPress={form.handleSubmit(onSubmit)}
                    >
                        {t('common.save')}
                    </Button>
                }
            </View>
        </FormProvider>
    );
}