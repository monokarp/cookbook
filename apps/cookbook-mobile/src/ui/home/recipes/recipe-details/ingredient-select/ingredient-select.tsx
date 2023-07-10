import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Switch, Text, TextInput } from "react-native-paper";
import { RegexPatterns } from "../../../../../constants";
import { ProductMeasuring } from "../../../../../domain/types/product/product-pricing";
import { Ingredient } from "../../../../../domain/types/recipe/ingredient";
import { FormatNumber, FormatString } from "../../../../../domain/util";
import { useUnsub } from "../../../../custom-hooks";
import { styles } from "./ingredient-select.style";
import { ProductSelect } from "./product-select/product-select";
import { Product } from "../../../../../domain/types/product/product";
import { useState } from "react";
import { ConfirmDeletionModal } from "../../../common/confirmation-modal";

export interface IngredientSelectProps {
    selectedIngredient: Ingredient,
    index: number,
    requestRemoval: () => void,
}

export interface IngredientFormData {
    selectedProduct: Product,
    units: string,
    measuringType?: string,
};

export function MapFormDataToIngredient(formData: IngredientFormData, fallback: Ingredient): Ingredient {
    const measuring = formData.measuringType as ProductMeasuring ?? fallback.serving.measuring;
    const units = measuring === ProductMeasuring.Units ? Number(formData.units) : FormatString.Weight(formData.units);

    return new Ingredient({
        product: formData.selectedProduct,
        serving: {
            units,
            measuring
        }
    })
}

export function IngredientSelect({ selectedIngredient, index, requestRemoval }: IngredientSelectProps) {
    const { t } = useTranslation();

    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const dismiss = () => setVisible(false);

    const { watch, trigger, getValues, formState: { errors } } = useFormContext();

    useUnsub(watch, () => trigger(`ingredients.${index}.units`));

    const formIngredient = (): Ingredient => {
        if (!getValues().ingredients) { return selectedIngredient; }

        const formData: IngredientFormData = getValues().ingredients[index];

        if (!formData) { return selectedIngredient; }

        return MapFormDataToIngredient(formData, selectedIngredient);
    }

    return (
        <View>
            <View style={styles.container}>

                <View style={styles.pickerWrapper}>
                    <Controller
                        name={`ingredients.${index}.selectedProduct`}
                        defaultValue={selectedIngredient.product}
                        rules={{
                            required: true,
                            validate: (value) => !!value.id,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <ProductSelect
                                ingredientPrice={value?.id ? formIngredient()?.price() : 0}
                                selectedProduct={value}
                                onSelect={onChange}
                                onLongPress={show}
                            />
                        )}
                    />
                </View>

                <View style={styles.servingUnitsWrapper}>
                    <Controller
                        name={`ingredients.${index}.units`}
                        defaultValue={selectedIngredient.serving.units ? FormatNumber.ServingUnits(selectedIngredient.serving) : ''}
                        rules={{
                            required: true,
                            validate: (value) => {
                                const regex = formIngredient()?.serving.measuring === ProductMeasuring.Units
                                    ? RegexPatterns.Money
                                    : RegexPatterns.Weight;

                                return regex.test(value) && Number(value) > 0
                            },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                mode="outlined"
                                label={t((formIngredient()?.serving.measuring === ProductMeasuring.Units) ? 'recipe.details.servingSizeInUnits' : 'recipe.details.servingSizeInGrams')}
                                style={styles.servingSizeInput}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                keyboardType='numeric'
                                value={value}
                            />
                        )}
                    />
                </View>

                <View style={styles.servingMeasureWrapper}>
                    {
                        formIngredient()?.product.pricing.measuring === ProductMeasuring.Units &&
                        <Controller
                            name={`ingredients.${index}.measuringType`}
                            defaultValue={selectedIngredient.serving.measuring}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Switch
                                    value={value === ProductMeasuring.Units}
                                    onValueChange={value => {
                                        onChange(value ? ProductMeasuring.Units : ProductMeasuring.Grams);
                                    }}
                                />
                            )}
                        />
                    }
                </View>
            </View>
            {errors.ingredients && errors.ingredients[index]?.selectedProduct && <Text style={styles.validationErrorLabel}>{t('validation.required.selectProduct')}</Text>}
            {errors.ingredients && errors.ingredients[index]?.units && <Text style={styles.validationErrorLabel}>{t('validation.required.decimalGTE', { gte: 0 })}</Text>}

            <ConfirmDeletionModal isVisible={visible} confirm={requestRemoval} dismiss={dismiss} />
        </View>
    );
}