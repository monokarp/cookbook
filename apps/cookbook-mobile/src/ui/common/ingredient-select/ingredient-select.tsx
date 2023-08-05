import { RegexPatterns } from "@cookbook/domain/constants";
import { Product } from "@cookbook/domain/types/product/product";
import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";
import { Prepack } from "@cookbook/domain/types/recipe/prepack";
import { PrepackIngredient } from "@cookbook/domain/types/recipe/prepack-ingredient";
import { ProductIngredient } from "@cookbook/domain/types/recipe/product-ingredient";
import { IngredientBase, Position, isPrepack, isPrepackIngredient, isProduct, isProductIngredient } from "@cookbook/domain/types/recipe/recipe";
import { FormatNumber, FormatString } from "@cookbook/domain/util";
import { TestIds, collectionElementId } from "@cookbook/ui/test-ids";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { FAB, Switch, Text, TextInput } from "react-native-paper";
import { ModalsContext } from "../modals/modals.context";
import { styles } from "./ingredient-select.style";

export interface IngredientSelectProps {
    ingredient: Position,
    allowAddingPrepacks: boolean,
    isEditing: boolean;
    index: number,
    requestEdit: () => void,
    onEditConfirmed: (update: Position) => void,
    onDelete: () => void,
}

function getBase(position: Position): IngredientBase {
    if (isProductIngredient(position)) {
        return position.product;
    }

    if (isPrepackIngredient(position)) {
        return position.prepack;
    }

    throw new Error('Unknown ingredient type');
}

interface IngredientSelectFormData {
    ingredientBase: Product | Prepack,
    measuringUnits: string,
}

export function IngredientSelect({ ingredient, isEditing, index, requestEdit, onEditConfirmed, onDelete, allowAddingPrepacks }: IngredientSelectProps) {
    const { t } = useTranslation();

    const isMeasuredInUnits = isProductIngredient(ingredient) && ingredient.product.pricing.measuring === ProductMeasuring.Units;
    const [selectedMeasuringType, setMeasuring] = useState(isMeasuredInUnits ? ProductMeasuring.Units : ProductMeasuring.Grams);

    const isServedInUnits = isProductIngredient(ingredient) && ingredient.serving.measuring === ProductMeasuring.Units;
    const measuringUnits = isServedInUnits ? ingredient.units().toString() : FormatNumber.Weight(ingredient.units());
    const measuringTypeLabel = t(isServedInUnits ? 'product.measuring.units' : 'product.measuring.grams');

    const { ingredientSelect, confirmation } = useContext(ModalsContext);

    const defaultValues = {
        ingredientBase: getBase(ingredient),
        measuringUnits: ingredient.units() ? measuringUnits : '',
    };

    const { control, handleSubmit, formState: { errors } } = useForm<IngredientSelectFormData>({
        mode: 'onSubmit',
        defaultValues
    });

    const submit = () => {
        handleSubmit(
            (data: IngredientSelectFormData) => {
                if (isProduct(data.ingredientBase)) {
                    onEditConfirmed(
                        new ProductIngredient({
                            product: data.ingredientBase as Product,
                            serving: {
                                units: selectedMeasuringType === ProductMeasuring.Units ? Number(data.measuringUnits) : FormatString.Weight(data.measuringUnits),
                                measuring: selectedMeasuringType,
                            }
                        })
                    );
                }

                if (isPrepack(data.ingredientBase)) {
                    onEditConfirmed(
                        new PrepackIngredient({
                            prepack: data.ingredientBase as Prepack,
                            weightInGrams: FormatString.Weight(data.measuringUnits),
                        })
                    );
                }
            }
        )();
    };

    return (
        isEditing
            ? <View style={{ margin: 5, backgroundColor: '#cccccc', borderRadius: 5 }}>
                <View style={{ padding: 15 }}>

                    <View style={{ flexDirection: 'row' }}>

                        <View style={{ flex: 4, flexDirection: 'row', flexWrap: 'wrap' }}>

                            <View style={{ width: '60%', flexDirection: 'column', justifyContent: 'center' }}>

                                <Controller
                                    control={control}
                                    name="ingredientBase"
                                    rules={{
                                        required: true,
                                        validate: (value) => !!value.id,
                                    }}
                                    render={({ field: { onChange, value } }) =>
                                        <Pressable
                                            testID={collectionElementId(TestIds.IngredientSelect.Ingredient.Button, index)}
                                            style={{ backgroundColor: 'pink' }}
                                            onPress={() => ingredientSelect(allowAddingPrepacks, e => {
                                                onChange(e)
                                            })}
                                            onLongPress={() =>
                                                confirmation(
                                                    t('lists.deleteItemPrompt'),
                                                    (result) => {
                                                        if (result === 'confirm') {
                                                            onDelete();
                                                        }
                                                    })}
                                        >
                                            <Text
                                                testID={collectionElementId(TestIds.IngredientSelect.Ingredient.Name, index)}
                                                variant="titleMedium">
                                                {value?.name ? value.name : t('product.search.noneSelected')} {isPrepack(value) ? t('recipe.details.isPrepack') : ''}
                                            </Text>
                                        </Pressable>
                                    }
                                />

                            </View>

                            <View style={{ width: '40%', flexDirection: 'row', }}>

                                <Controller
                                    control={control}
                                    name="measuringUnits"
                                    rules={{
                                        required: true,
                                        validate: (value) => {
                                            const regex = selectedMeasuringType === ProductMeasuring.Units
                                                ? RegexPatterns.Money
                                                : RegexPatterns.Weight;

                                            return regex.test(value) && Number(value) > 0
                                        },
                                    }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextInput
                                            testID={collectionElementId(TestIds.IngredientSelect.UnitsInput, index)}
                                            style={{ flexGrow: 1 }}
                                            mode="outlined"
                                            value={value}
                                            onChangeText={onChange}
                                            label={t(selectedMeasuringType === ProductMeasuring.Units ? 'product.measuring.units' : 'product.measuring.grams')}
                                            keyboardType='numeric'
                                        />
                                    }
                                />

                                {
                                    isMeasuredInUnits &&
                                    <Switch
                                        testID={collectionElementId(TestIds.IngredientSelect.UnitsToggle, index)}
                                        value={selectedMeasuringType === ProductMeasuring.Units}
                                        onValueChange={value => {
                                            setMeasuring(value ? ProductMeasuring.Units : ProductMeasuring.Grams);
                                        }}
                                    />
                                }
                            </View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <FAB
                                icon={'check-bold'}
                                onPress={submit}
                            />
                        </View>

                    </View>
                    {
                        errors.ingredientBase &&
                        <Text testID={collectionElementId(TestIds.IngredientSelect.Ingredient.RequiredError, index)} style={styles.validationErrorLabel}>{t('validation.required.selectProduct')}</Text>
                    }
                    {
                        errors.measuringUnits &&
                        <Text testID={collectionElementId(TestIds.IngredientSelect.Ingredient.UnitsError, index)} style={styles.validationErrorLabel}>{t('validation.required.decimalGTE', { gte: 0 })}</Text>
                    }
                </View>
            </View >

            : <View style={{ margin: 5, backgroundColor: '#cccccc', borderRadius: 5 }}>
                <View style={{ padding: 15 }}>

                    <View style={{ flexDirection: 'row' }}>

                        <View style={{ flex: 4, flexDirection: 'row', flexWrap: 'wrap' }}>

                            <View style={{ width: '60%', flexDirection: 'column', justifyContent: 'center' }}>
                                <Text
                                    testID={collectionElementId(TestIds.IngredientSelect.Ingredient.Name, index)}
                                    variant="titleMedium"
                                >
                                    {getBase(ingredient).name} {isPrepack(getBase(ingredient)) ? t('recipe.details.isPrepack') : ''}
                                </Text>

                                <Text
                                    testID={collectionElementId(TestIds.IngredientSelect.Ingredient.Price, index)}
                                    variant="labelSmall"
                                >
                                    {`${t('recipe.ingredientPrice')} ${FormatNumber.Money(ingredient.price())}`}
                                </Text>
                            </View>

                            <View style={{ width: '40%', flexDirection: 'row', alignItems: 'center' }}>

                                <Text style={{ flexGrow: 1, fontSize: 16 }} variant="labelSmall" >
                                    {measuringUnits} {measuringTypeLabel}
                                </Text>

                            </View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <FAB
                                icon={'file-edit'}
                                onPress={requestEdit}
                            />
                        </View>

                    </View>
                </View>
            </View>
    );
}