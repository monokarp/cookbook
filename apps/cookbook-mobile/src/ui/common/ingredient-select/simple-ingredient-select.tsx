import { RegexPatterns } from "@cookbook/domain/constants";
import { Product } from "@cookbook/domain/types/product/product";
import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";
import { Prepack } from "@cookbook/domain/types/recipe/prepack";
import { PrepackIngredient } from "@cookbook/domain/types/recipe/prepack-ingredient";
import { ProductIngredient } from "@cookbook/domain/types/recipe/product-ingredient";
import { IngredientBase, Position, isPrepack, isPrepackIngredient, isProductIngredient } from "@cookbook/domain/types/recipe/recipe";
import { FormatNumber, FormatString } from "@cookbook/domain/util";
import { TestIds, collectionElementId } from "@cookbook/ui/test-ids";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { FAB, Switch, Text, TextInput } from "react-native-paper";
import { ModalsContext } from "../modals/modals.context";
import { styles } from "./ingredient-select.style";
import { PrepackDetailsContext } from "../../home/prepacks/prepack-details/prepack-details.store";

export interface IngredientSelectProps {
    ingredient: Position,
    allowAddingPrepacks: boolean,
    index: number,
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

export function SimpleIngredientSelect({ ingredient, index, onEditConfirmed, onDelete, allowAddingPrepacks }: IngredientSelectProps) {
    console.log('ingredient select rendered');
    const { t } = useTranslation();

    const isMeasuredInUnits = isProductIngredient(ingredient) && ingredient.product.pricing.measuring === ProductMeasuring.Units;
    const [selectedMeasuringType, setMeasuring] = useState(isMeasuredInUnits ? ProductMeasuring.Units : ProductMeasuring.Grams);

    const isServedInUnits = isProductIngredient(ingredient) && ingredient.serving.measuring === ProductMeasuring.Units;
    const measuringUnits = isServedInUnits ? ingredient.units().toString() : FormatNumber.Weight(ingredient.units());
    const measuringTypeLabel = t(isServedInUnits ? 'product.measuring.units' : 'product.measuring.grams');

    const { ingredientSelect, confirmation } = useContext(ModalsContext);


    const store = useContext(PrepackDetailsContext);
    const { hasIngredientsEditing, setIngredientsEditing } = store();

    const defaultValues = {
        ingredientBase: getBase(ingredient),
        measuringUnits: ingredient.units() ? measuringUnits : '',
    };

    const { control, handleSubmit, formState: { errors } } = useForm<IngredientSelectFormData>({
        mode: 'onSubmit',
        defaultValues
    });

    const [isEditMode, setEditMode] = useState(!getBase(ingredient).id);

    const toggleLocalEdit = () => {
        if (isEditMode) {
            handleSubmit(
                (data: IngredientSelectFormData) => {
                    // @TODO do not emit if overall ingredient has not changed
                    if (isProductIngredient(ingredient)) {
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

                    if (isPrepackIngredient(ingredient)) {
                        onEditConfirmed(
                            new PrepackIngredient({
                                prepack: data.ingredientBase as Prepack,
                                weightInGrams: FormatString.Weight(data.measuringUnits),
                            })
                        );
                    }

                    setEditMode(false);
                }
            )();
            setIngredientsEditing(false);
        } else {
            if (!hasIngredientsEditing) {
                setEditMode(true);
                setIngredientsEditing(true);
            }
        }
    };

    return (
        isEditMode
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
                                            <Text variant="titleMedium">
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
                                onPress={toggleLocalEdit}
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
                                <Text variant="titleMedium">
                                    {getBase(ingredient).name} {isPrepack(getBase(ingredient)) ? t('recipe.details.isPrepack') : ''}
                                </Text>

                                <Text style={{}} variant="labelSmall">
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
                                onPress={toggleLocalEdit}
                            />
                        </View>

                    </View>
                </View>
            </View>
    );
}