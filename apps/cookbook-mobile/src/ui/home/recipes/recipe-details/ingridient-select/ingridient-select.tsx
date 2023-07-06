import { Ingridient } from "apps/cookbook-mobile/src/domain/types/recipe/ingridient";
import { withUnsub } from "apps/cookbook-mobile/src/ui/custom-hooks";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Switch, Text, TextInput } from "react-native-paper";
import { styles } from "./ingridient-select.style";
import { ProductSelect } from "./product-select/product-select";
import { RegexPatterns } from "apps/cookbook-mobile/src/constants";
import { useState } from "react";
import { ProductMeasuring } from "apps/cookbook-mobile/src/domain/types/product/product-pricing";
import { FormatNumber, FormatString } from "apps/cookbook-mobile/src/domain/util";

export interface IngridientSelectProps {
    selectedIngridient: Ingridient,
    onChange: (data: Ingridient) => void,
}

export function IngridientSelect({ selectedIngridient, onChange }: IngridientSelectProps) {
    const { t } = useTranslation();

    const [ingridient, setIngridient] = useState(selectedIngridient);

    const isMeasuredInUnits = ingridient.serving.measuring !== ProductMeasuring.Grams;

    const { control, watch, formState: { errors }, trigger, getValues } = useForm({
        defaultValues: {
            selectedProduct: ingridient.product,
            units: (isMeasuredInUnits ? FormatNumber.Units : FormatNumber.Weight)(ingridient.serving.units),
            measuringType: isMeasuredInUnits
        },
        mode: 'onChange'
    });

    withUnsub(watch, (data) => {
        trigger().then(isValid => {
            if (isValid) {
                const update = new Ingridient({
                    product: data.selectedProduct,
                    serving: {
                        units: data.measuringType ? Number(data.units) : FormatString.Weight(data.units),
                        measuring: data.measuringType ? ProductMeasuring.Units : ProductMeasuring.Grams
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
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <ProductSelect
                                ingridientPrice={ingridient.price()}
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
                            validate: (value) => (getValues().measuringType ? RegexPatterns.Money : RegexPatterns.Weight).test(value) && Number(value) > 0,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                mode="outlined"
                                label={t(getValues().measuringType ? 'recipe.details.servingSizeInUnits' : 'recipe.details.servingSizeInGrams')}
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
                                <Switch value={value} onValueChange={onChange} />
                            )}
                            name="measuringType"
                        />
                    }
                </View>

            </View>
            {errors.units && <Text style={styles.validationErrorLabel}>{t('validation.required.decimalGTE', { gte: 0 })}</Text>}
        </View>
    );
}