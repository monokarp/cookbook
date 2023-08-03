import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";
import { IngredientBase, Position, isPrepack, isPrepackIngredient, isProductIngredient } from "@cookbook/domain/types/recipe/recipe";
import { FormatNumber } from "@cookbook/domain/util";
import { useContext, useRef, useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Card, FAB, SegmentedButtons, Switch, Text, TextInput } from "react-native-paper";
import { Pressable, View } from "react-native";
import { TestIds, collectionElementId } from "@cookbook/ui/test-ids";
import { Product } from "@cookbook/domain/types/product/product";
import { Prepack } from "@cookbook/domain/types/recipe/prepack";
import { ModalsContext } from "../modals/modals.context";
import { RegexPatterns } from "@cookbook/domain/constants";
import { styles } from "./ingredient-select.style";

export interface IngredientSelectProps {
    ingredient: Position,
    allowAddingPrepacks: boolean,
    index: number,
    onChange: (update: Position) => void,
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

export function SimpleIngredientSelect({ ingredient, index, onChange, onDelete, allowAddingPrepacks }: IngredientSelectProps) {
    console.log('ingredient select rendered');
    const { t } = useTranslation();

    const isMeasuredInUnits = isProductIngredient(ingredient) && ingredient.product.pricing.measuring === ProductMeasuring.Units;
    const isServedInUnits = isProductIngredient(ingredient) && ingredient.serving.measuring === ProductMeasuring.Units;
    const measuringUnits = isServedInUnits ? ingredient.units().toString() : FormatNumber.Weight(ingredient.units());
    const measuringTypeLabel = t(isServedInUnits ? 'product.measuring.units' : 'product.measuring.grams');

    const { ingredientSelect, confirmation } = useContext(ModalsContext);

    const { handleSubmit, watch, trigger, getValues, formState: { errors } } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            ingredientBase: getBase(ingredient),
            measuringUnits: ingredient.units() ? measuringUnits : '',
            measuringType: isMeasuredInUnits ? ProductMeasuring.Units : ProductMeasuring.Grams
        }
    });

    // const measuring = formData.measuringType as ProductMeasuring ?? ProductMeasuring.Grams;
    // const units = measuring === ProductMeasuring.Units ? Number(formData.units ?? '') : FormatString.Weight(formData.units ?? '');

    const [isEditMode, setEditMode] = useState(!getBase(ingredient).id);

    const toggleEdit = () => {
        if (isEditMode) {
            handleSubmit(data => {
                console.log('ingredient row submit', data);
            });

            setEditMode(false);
        } else {
            setEditMode(true);
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
                                    name="ingredientBase"
                                    rules={{
                                        required: true,
                                        validate: (value) => !!value.id,
                                    }}
                                    render={({ field: { onChange, value } }) =>
                                        <Pressable
                                            style={{ backgroundColor: 'pink' }}
                                            onPress={() => ingredientSelect(allowAddingPrepacks, e => {
                                                console.log('selected ingredient', e);
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
                                                {value.name ? value.name : t('product.search.noneSelected')} {isPrepack(value) ? t('recipe.details.isPrepack') : ''}
                                            </Text>

                                            {
                                                value.name &&
                                                <Text style={{}} variant="labelSmall">
                                                    {`${t('recipe.ingredientPrice')} ${FormatNumber.Money(ingredient.price())}`}
                                                </Text>
                                            }
                                        </Pressable>
                                    }
                                />

                            </View>

                            <View style={{ width: '40%', flexDirection: 'row', }}>

                                <Controller
                                    name="measuringUnits"
                                    rules={{
                                        required: true,
                                        validate: (value) => {
                                            const regex = isServedInUnits
                                                ? RegexPatterns.Money
                                                : RegexPatterns.Weight;

                                            return regex.test(value) && Number(value) > 0
                                        },
                                    }}
                                    render={({ field: { value } }) =>
                                        <TextInput
                                            style={{ flexGrow: 1 }}
                                            mode="flat"
                                            value={value}
                                            label={measuringTypeLabel}
                                        />
                                    }
                                />

                                {
                                    isMeasuredInUnits &&
                                    <Controller
                                        name="measuringType"
                                        render={({ field: { value } }) =>
                                            <Switch
                                                testID={collectionElementId(TestIds.IngredientSelect.UnitsToggle, index)}
                                                value={value === ProductMeasuring.Units}
                                            // onValueChange={value => {
                                            //     onChange(value ? ProductMeasuring.Units : ProductMeasuring.Grams);
                                            // }}
                                            />
                                        }
                                    />
                                }
                            </View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <FAB
                                icon={'check-bold'}
                                onPress={toggleEdit}
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
                                onPress={toggleEdit}
                            />
                        </View>

                    </View>
                </View>
            </View>
    );
}