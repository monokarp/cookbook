import { RegexPatterns } from "@cookbook/domain/constants";
import { ProductIngredient } from "@cookbook/domain/types/recipe/product-ingredient";
import { FormatNumber, FormatString } from "@cookbook/domain/util";
import { TestIds } from "@cookbook/ui/test-ids";
import { useInjection } from "inversify-react-native";
import { useContext, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FlatList, KeyboardAvoidingView, View } from "react-native";
import { Appbar, Divider, FAB, Text, TextInput } from "react-native-paper";
import { PrepacksRepository } from "../../../../core/repositories/prepack.repository";
import { IngredientSelect } from "../../../common/ingredient-select/ingredient-select";
import { usePrepacksStore } from "../prepacks.store";
import { PrepackDescription } from "./prepack-description/prepack-description";
import { PrepackDetailsContext } from "./prepack-details.store";
import { styles } from "./prepack-details.style";


export function PrepackDetails({ navigation }) {
    let listElementRef: FlatList<ProductIngredient> | null = null;

    const { t } = useTranslation();

    const prepacksRepo = useInjection(PrepacksRepository);

    const store = useContext(PrepackDetailsContext);
    const { addIngredient, removeIngredient, setIngredient } = store();
    const prepack = store(state => state.prepack);
    const ingredients = store(state => state.prepack.ingredients);

    console.log(`prepack details rendered ${prepack.name}`)

    const [currentlyEditedItemIndex, setCurrentlyEditedItemIndex] = useState<number | null>(null);

    const { set: setPrepacks } = usePrepacksStore();

    const form = useForm({
        defaultValues: {
            name: prepack.name,
            finalWeight: prepack.finalWeight ? FormatNumber.Weight(prepack.finalWeight) : '',
            description: prepack.description,
        }
    });

    const onSubmit = async (data: { name: string, finalWeight: string, description: string }) => {
        await prepacksRepo.Save({
            ...prepack,
            name: data.name,
            finalWeight: FormatString.Weight(data.finalWeight),
            description: data.description,
        });

        await prepacksRepo.All().then(setPrepacks);

        navigation.goBack();
    };

    function addEmptyIngredient() {
        addIngredient(ProductIngredient.Empty());
        setCurrentlyEditedItemIndex(prepack.ingredients.length);
        if (prepack.ingredients.length) {
            listElementRef.scrollToIndex({ index: prepack.ingredients.length - 1 });
        }
    };

    function removeIngredientRow(index: number) {
        removeIngredient(index);
        setCurrentlyEditedItemIndex(null);
    }

    return (
        <FormProvider {...form}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={t('prepack.details.title')} />
                <Appbar.Action icon="check-bold" onPress={form.handleSubmit(onSubmit)} testID={TestIds.PrepackDetails.Submit} />
            </Appbar.Header>
            <KeyboardAvoidingView style={styles.container}>
                <FlatList
                    ref={ref => listElementRef = ref}
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

                                <Controller
                                    render={({ field: { onChange, value } }) => (
                                        <PrepackDescription value={value} onChange={onChange} />
                                    )}
                                    name="description"
                                />

                                <Divider />
                            </View>
                        </View>
                    }
                    renderItem={({ item, index }) =>
                        <IngredientSelect
                            allowAddingPrepacks={false}
                            ingredient={item}
                            index={index}
                            isEditing={currentlyEditedItemIndex === index}
                            requestEdit={() => {
                                setCurrentlyEditedItemIndex(index)
                            }}
                            onEditConfirmed={(position) => {
                                setIngredient(position as ProductIngredient, index);
                                setCurrentlyEditedItemIndex(null);
                            }}
                            onDelete={() => {
                                removeIngredientRow(index);
                            }}
                        />
                    }
                    ListFooterComponentStyle={{ justifyContent: 'center' }}
                    ListFooterComponent={() =>
                        <FAB
                            testID={TestIds.PrepackDetails.AddIngredient}
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