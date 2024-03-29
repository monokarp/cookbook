import { RegexPatterns } from "@cookbook/domain/constants";
import { IngredientBase, Position, isPrepack, isPrepackIngredient, isProduct, isProductIngredient } from "@cookbook/domain/types/position/position";
import { PrepackIngredient } from "@cookbook/domain/types/position/prepack-ingredient";
import { ProductIngredient } from "@cookbook/domain/types/position/product-ingredient";
import { Prepack } from "@cookbook/domain/types/prepack/prepack";
import { Product } from "@cookbook/domain/types/product/product";
import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";
import { FormatNumber, FormatString } from "@cookbook/domain/util";
import { TestIds, collectionElementId } from "@cookbook/ui/test-ids";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { Divider, IconButton, Switch, Text, TextInput, withTheme } from "react-native-paper";
import { useAppModals } from "../modals/use-modals.hook";
import { styles } from "./ingredient-select.style";

export interface IngredientSelectProps {
    ingredient: Position,
    ingredientList: (Product | Prepack)[],
    isEditing: boolean;
    index: number,
    requestEdit: () => void,
    onEditConfirmed: (update: Position) => void,
    onDelete: () => void,
    toggleGroupEditing?: () => void,
    toggleItemGrouping?: () => void,
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

export const IngredientSelect = withTheme(_IngredientSelect);

function _IngredientSelect({
    ingredientList,
    ingredient,
    isEditing,
    index,
    requestEdit,
    onEditConfirmed,
    onDelete,
    toggleGroupEditing,
    toggleItemGrouping,
    theme
}: IngredientSelectProps & { theme }) {
    const { t } = useTranslation();

    const isServedInUnits = isProductIngredient(ingredient) && ingredient.serving.measuring === ProductMeasuring.Units;
    const measuringUnits = isServedInUnits ? ingredient.units().toString() : FormatNumber.Weight(ingredient.units());

    const { ingredientPicker, confirmation } = useAppModals();

    const [selectedBase, setSelectedBase] = useState(getBase(ingredient));
    const isMeasuredInUnits = isProduct(selectedBase) && selectedBase.pricing.measuring === ProductMeasuring.Units;
    const [selectedMeasuringType, setMeasuring] = useState(isMeasuredInUnits ? ProductMeasuring.Units : ProductMeasuring.Grams);

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
                if (isProduct(selectedBase)) {
                    onEditConfirmed(
                        new ProductIngredient({
                            product: selectedBase as Product,
                            serving: {
                                units: selectedMeasuringType === ProductMeasuring.Units ? Number(data.measuringUnits) : FormatString.Weight(data.measuringUnits),
                                measuring: selectedMeasuringType,
                            }
                        })
                    );
                }

                if (isPrepack(selectedBase)) {
                    onEditConfirmed(
                        new PrepackIngredient({
                            prepack: selectedBase as Prepack,
                            weightInGrams: FormatString.Weight(data.measuringUnits),
                        })
                    );
                }
            }
        )();
    };

    return (
        <View style={{ width: '100%' }}>
            {
                isEditing
                    ? <View style={{ margin: 2, backgroundColor: 'white' }}>
                        <View style={{ padding: 5 }}>

                            <View style={{ flexDirection: 'row' }}>

                                <View style={{ flex: 4, flexDirection: 'row', flexWrap: 'wrap' }}>

                                    <View style={{ width: '60%', flexDirection: 'column', justifyContent: 'center' }}>

                                        <Controller
                                            control={control}
                                            name="ingredientBase"
                                            rules={{
                                                required: true,
                                                validate: () => !!selectedBase.id,
                                            }}
                                            render={() =>
                                                <Pressable
                                                    testID={collectionElementId(TestIds.IngredientSelect.Ingredient.Button, index)}
                                                    style={{ paddingLeft: 5, paddingVertical: 10, marginRight: 10, backgroundColor: theme.colors.secondaryContainer, borderRadius: 5 }}
                                                    onPress={() => ingredientPicker.show(ingredientList, setSelectedBase)}
                                                    onLongPress={() =>
                                                        confirmation.show({
                                                            message: t('lists.deleteItemPrompt'),
                                                            onResult: (result) => {
                                                                if (result === 'confirm') {
                                                                    onDelete();
                                                                }
                                                            }
                                                        })
                                                    }
                                                >
                                                    <Text
                                                        testID={collectionElementId(TestIds.IngredientSelect.Ingredient.Name, index)}
                                                        variant="titleSmall">
                                                        {selectedBase?.name ? selectedBase.name : t('product.search.noneSelected')} {isPrepack(selectedBase) ? t('recipe.details.isPrepack') : ''}
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
                                    <IconButton
                                        testID={collectionElementId(TestIds.IngredientSelect.Edit, index)}
                                        icon={'check-bold'}
                                        onTouchEnd={submit}
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

                    : <View style={{ margin: 1 }}>
                        <Pressable onPress={() => toggleItemGrouping?.()} onLongPress={() => toggleGroupEditing?.()}>
                            <View style={{ padding: 5 }}>
                                <View style={{ flexDirection: 'row' }}>

                                    <View style={{ flex: 4, flexDirection: 'row', flexWrap: 'wrap' }}>

                                        <View style={{ width: '60%', flexDirection: 'column', justifyContent: 'center' }}>
                                            <Text
                                                testID={collectionElementId(TestIds.IngredientSelect.Ingredient.Name, index)}
                                                variant="titleSmall"
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
                                                {measuringUnits}
                                            </Text>

                                        </View>
                                    </View>

                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        <IconButton
                                            testID={collectionElementId(TestIds.IngredientSelect.Edit, index)}
                                            icon={'file-edit'}
                                            onPress={requestEdit}
                                        />
                                    </View>

                                </View>
                            </View>
                        </Pressable>
                    </View>
            }
            <Divider />
        </View >
    );
}