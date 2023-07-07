import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Switch, Text, TextInput } from "react-native-paper";
import { RegexPatterns } from "../../../../../constants";
import { Product } from "../../../../../domain/types/product/product";
import { ProductMeasuring } from "../../../../../domain/types/product/product-pricing";
import { Ingridient } from "../../../../../domain/types/recipe/ingridient";
import { FormatNumber, FormatString } from "../../../../../domain/util";
import { useUnsub } from "../../../../../ui/custom-hooks";
import { styles } from "./ingridient-select.style";
import { ProductSelect } from "./product-select/product-select";

export interface IngridientSelectProps {
    selectedIngridient: Ingridient,
    onChange: (data: Ingridient) => void,
}

export function IngridientSelect({ selectedIngridient, onChange }: IngridientSelectProps) {
    const { t } = useTranslation();

    const [ingridient, setIngridient] = useState(selectedIngridient);

    const { control, watch, formState: { errors }, trigger, getValues } = useForm({
        defaultValues: {
            selectedProduct: ingridient.product,
            units: ingridient.serving.units ? FormatNumber.ServingUnits(ingridient.serving) : '',
            measuringType: ingridient.serving.measuring
        },
        mode: 'onTouched'
    });

    useUnsub(watch, (data) => {
        console.log('form changed', data)
        trigger().then(isValid => {
            console.log('form valid', isValid)
            if (isValid) {
                const update = new Ingridient({
                    product: data.selectedProduct as Product,
                    serving: data.measuringType === ProductMeasuring.Units
                        ? {
                            units: Number(data.units),
                            measuring: ProductMeasuring.Units,
                        }
                        : {
                            units: FormatString.Weight(data.units),
                            measuring: ProductMeasuring.Grams,
                        }
                });

                setIngridient(update);

                onChange(update);
            }
        });
    });

    return (
        <View>
            <View style={styles.container}>

                <View style={styles.pickerWrapper}>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                            validate: (value) => !!value.id,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <ProductSelect
                                ingridientPrice={value.id ? ingridient.price() : 0}
                                selectedProduct={value}
                                onSelect={onChange}
                            />
                        )}
                        name="selectedProduct"
                    />
                </View>

                <View style={styles.servingUnitsWrapper}>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                            validate: (value) => (getValues().measuringType === ProductMeasuring.Units ? RegexPatterns.Money : RegexPatterns.Weight).test(value) && Number(value) > 0,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                mode="outlined"
                                label={t(getValues().measuringType === ProductMeasuring.Units ? 'recipe.details.servingSizeInUnits' : 'recipe.details.servingSizeInGrams')}
                                style={styles.servingSizeInput}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                keyboardType='numeric'
                                value={value}
                            />
                        )}
                        name="units"
                    />
                </View>

                <View style={styles.servingMeasureWrapper}>
                    {
                        ingridient.product.pricing.measuring === ProductMeasuring.Units &&
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Switch
                                    value={value === ProductMeasuring.Units}
                                    onValueChange={value => onChange(value ? ProductMeasuring.Units : ProductMeasuring.Grams)}
                                />
                            )}
                            name="measuringType"
                        />
                    }
                </View>

            </View>
            {errors.selectedProduct && <Text style={styles.validationErrorLabel}>{t('validation.required.selectProduct')}</Text>}
            {errors.units && <Text style={styles.validationErrorLabel}>{t('validation.required.decimalGTE', { gte: 0 })}</Text>}
        </View>
    );
}