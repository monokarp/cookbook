import { RegexPatterns } from "@cookbook/domain/constants";
import { ProductIngredient } from "@cookbook/domain/types/recipe/product-ingredient";
import { FormatNumber, FormatString } from "@cookbook/domain/util";
import { TestIds } from "@cookbook/ui/test-ids";
import { useInjection } from "inversify-react-native";
import { useContext } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FlatList, KeyboardAvoidingView, View } from "react-native";
import { FAB, Text, TextInput } from "react-native-paper";
import { PrepacksRepository } from "../../../../core/repositories/prepack.repository";
import { SimpleIngredientSelect } from "../../../common/ingredient-select/simple-ingredient-select";
import { usePrepacksStore } from "../prepacks.store";
import { PrepackDetailsContext } from "./prepack-details.store";
import { styles } from "./prepack-details.style";


export function PrepackDetails({ navigation }) {
    let listElementRef: FlatList<ProductIngredient> | null = null;

    console.log('prepack details rendered')
    const { t } = useTranslation();

    const prepacksRepo = useInjection(PrepacksRepository);

    const store = useContext(PrepackDetailsContext);
    const { hasIngredientsEditing, setIngredientsEditing, addIngredient, removeIngredient, setIngredient } = store();
    const prepack = store(state => state.prepack);
    const ingredients = store(state => state.prepack.ingredients);

    const { set: setPrepacks } = usePrepacksStore();

    const form = useForm({
        defaultValues: {
            name: prepack.name,
            finalWeight: prepack.finalWeight ? FormatNumber.Weight(prepack.finalWeight) : '',
        }
    });

    const onSubmit = async (data: { name: string, finalWeight: string }) => {
        console.log('saving prepack', JSON.stringify(prepack))
        if (hasIngredientsEditing) {
            return;
        }

        await prepacksRepo.Save({ ...prepack, name: data.name, finalWeight: FormatString.Weight(data.finalWeight) });

        await prepacksRepo.All().then(setPrepacks);

        navigation.goBack();
    };

    function addEmptyIngredient() {
        if (hasIngredientsEditing) {
            return;
        }

        addIngredient(ProductIngredient.Empty());
        setIngredientsEditing(true);
    };

    function removeIngredientRow(index: number) {
        removeIngredient(index);
        setIngredientsEditing(false);
    }

    return (
        <FormProvider {...form}>
            <KeyboardAvoidingView style={styles.container}>
                <FlatList
                    ref={ref => listElementRef = ref}
                    onContentSizeChange={() => listElementRef.scrollToEnd()}
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
                            onEditConfirmed={(position) => {
                                console.log('position edit confirmed', position)
                                setIngredient(position as ProductIngredient, index);
                            }}
                            onDelete={() => {
                                removeIngredientRow(index);
                            }}
                        />
                    }
                />
            </KeyboardAvoidingView>
        </FormProvider>
    );
}