import { RegexPatterns } from "@cookbook/domain/constants";
import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";
import { Prepack } from "@cookbook/domain/types/recipe/prepack";
import { ProductIngredient } from "@cookbook/domain/types/recipe/product-ingredient";
import { FormatNumber, FormatString } from "@cookbook/domain/util";
import { useInjection } from "inversify-react-native";
import { useContext, useEffect } from "react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FlatList, KeyboardAvoidingView, View } from "react-native";
import { Button, FAB, Text, TextInput } from "react-native-paper";
import { PrepacksRepository } from "../../../../core/repositories/prepack.repository";
import { ProductsRepository } from "../../../../core/repositories/products.repository";
import { useSubscription } from "../../../custom-hooks";
import { useKeyboardVisible } from "../../common/use-kb-visible";
import { useProductsStore } from "../../products/products.store";
import { IngredientFormData, IngredientSelect, MapFormDataToIngredient } from "../../recipes/recipe-details/ingredient-select/ingredient-select";
import { usePrepacksStore } from "../prepacks.store";
import { PrepackDetailsContext } from "./prepack-details.store";
import { styles } from "./prepack-details.style";
import { TestIds } from "@cookbook/ui/test-ids";
import { SimpleIngredientSelect } from "../../common/ingredient-select/simple-ingredient-select";

interface PrepackDetailsFormData {
    name: string,
    finalWeight: string,
    ingredients: IngredientFormData[],
}

export function PrepackDetails({ navigation }) {

    console.log('prepack details rendered')
    const { t } = useTranslation();

    const prepacksRepo = useInjection(PrepacksRepository);
    const productsRepo = useInjection(ProductsRepository);

    const store = useContext(PrepackDetailsContext);
    const { setPrepack, addIngredient, removeIngredient } = store();
    const prepack = store(state => state.prepack);
    const ingredients = store(state => state.prepack.ingredients);

    const { set: setPrepacks } = usePrepacksStore();
    const { set: setProducts } = useProductsStore();

    const form = useForm({
        defaultValues: {
            name: prepack.name,
            finalWeight: prepack.finalWeight ? FormatNumber.Weight(prepack.finalWeight) : '',
        }
    });

    // useSubscription(form.watch, (data: PrepackDetailsFormData) => {
    //     const updatedPrepack = new Prepack({
    //         id: prepack.id,
    //         name: data.name,
    //         lastModified: prepack.lastModified,
    //         finalWeight: FormatString.Weight(data.finalWeight),
    //         ingredients: data.ingredients.map((ingredient, index) => MapFormDataToIngredient(ingredient) as ProductIngredient),
    //     });

    //     setPrepack(updatedPrepack);
    // });

    const onSubmit = async () => {
        await prepacksRepo.Save(prepack);

        await prepacksRepo.All().then(setPrepacks);

        navigation.goBack();
    };

    function addEmptyIngredient() {
        addIngredient(ProductIngredient.Empty());
    };

    function deleteIngredient(index: number) {
        removeIngredient(index);
    };

    // useEffect(() => {
    //     productsRepo.All().then(setProducts);
    // }, []);

    return (
        <FormProvider {...form}>
            <KeyboardAvoidingView style={styles.container}>
                <FlatList
                    style={{ flexGrow: 0, width: '100%' }}
                    keyExtractor={(item, index) => `${index}_${item.product.id}`}
                    data={ingredients}
                    ListHeaderComponent={
                        <View style={{ flexDirection: 'row' }}>

                            <View style={{ flex: 4 }}>
                                <Controller
                                    rules={{
                                        required: true,
                                        pattern: RegexPatterns.EntityName
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
                                    && <Text testID={TestIds.PrepackDetails.NameInputError} style={styles.validationErrorLabel}>{t('validation.required.alphanumeric')}</Text>
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
                                            keyboardType='numeric'
                                            value={value}
                                        />
                                    )}
                                    name="finalWeight"
                                />
                                {
                                    form.formState.errors.finalWeight
                                    && <Text testID={TestIds.PrepackDetails.WeightInputError} style={styles.validationErrorLabel}>{t('validation.required.decimalGTE', { gte: 0 })}</Text>
                                }

                                <Text variant="labelLarge" style={{ margin: 5 }}>
                                    {`${t('product.pricing.totalPrice')}: ${FormatNumber.Money(prepack.price())}`}
                                </Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <FAB
                                    testID={TestIds.PrepackDetails.Submit}
                                    icon="check-bold"
                                    style={{ margin: 15 }}
                                    onPress={form.handleSubmit(onSubmit)}
                                />

                                <FAB
                                    testID={TestIds.PrepackDetails.AddIngredient}
                                    icon="plus"
                                    style={{ margin: 15 }}
                                    onPress={addEmptyIngredient}
                                />
                            </View>
                        </View>
                    }
                    renderItem={({ item, index }) =>
                        <SimpleIngredientSelect
                            allowAddingPrepacks={false}
                            ingredient={item}
                            index={index}
                            requestRemoval={() => deleteIngredient(index)}
                        />
                    }
                />
            </KeyboardAvoidingView>
        </FormProvider>
    );
}