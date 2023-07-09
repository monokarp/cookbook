import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Switch, Text, TextInput } from "react-native-paper";
import { RegexPatterns } from "../../../../../constants";
import { ProductMeasuring } from "../../../../../domain/types/product/product-pricing";
import { Ingridient } from "../../../../../domain/types/recipe/ingridient";
import { FormatNumber, FormatString } from "../../../../../domain/util";
import { useUnsub } from "../../../../../ui/custom-hooks";
import { styles } from "./ingridient-select.style";
import { ProductSelect } from "./product-select/product-select";
import { Product } from "../../../../../domain/types/product/product";
import { useState } from "react";
import { ConfirmDeletionModal } from "../../../common/confirmation-modal";

export interface IngridientSelectProps {
    selectedIngridient: Ingridient,
    index: number,
    requestRemoval: () => void,
}

export interface IngridientFormData {
    selectedProduct: Product,
    units: string,
    measuringType?: string,
};

export function MapFormDataToIngridient(formData: IngridientFormData, fallback: Ingridient): Ingridient {
    const measuring = formData.measuringType as ProductMeasuring ?? fallback.serving.measuring;
    const units = measuring === ProductMeasuring.Units ? Number(formData.units) : FormatString.Weight(formData.units);

    return new Ingridient({
        product: formData.selectedProduct,
        serving: {
            units,
            measuring
        }
    })
}

export function IngridientSelect({ selectedIngridient, index, requestRemoval }: IngridientSelectProps) {
    const { t } = useTranslation();

    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const dismiss = () => setVisible(false);

    const { watch, trigger, getValues, formState: { errors } } = useFormContext();

    useUnsub(watch, () => trigger(`ingridients.${index}.units`));

    const formIngridient = (): Ingridient => {
        if (!getValues().ingridients) { return selectedIngridient; }

        const formData: IngridientFormData = getValues().ingridients[index];

        if (!formData) { return selectedIngridient; }

        return MapFormDataToIngridient(formData, selectedIngridient);
    }

    return (
        <View>
            <View style={styles.container}>

                <View style={styles.pickerWrapper}>
                    <Controller
                        name={`ingridients.${index}.selectedProduct`}
                        defaultValue={selectedIngridient.product}
                        rules={{
                            required: true,
                            validate: (value) => !!value.id,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <ProductSelect
                                ingridientPrice={value?.id ? formIngridient()?.price() : 0}
                                selectedProduct={value}
                                onSelect={onChange}
                                onLongPress={show}
                            />
                        )}
                    />
                </View>

                <View style={styles.servingUnitsWrapper}>
                    <Controller
                        name={`ingridients.${index}.units`}
                        defaultValue={FormatNumber.ServingUnits(selectedIngridient.serving)}
                        rules={{
                            required: true,
                            validate: (value) => {
                                const regex = formIngridient()?.serving.measuring === ProductMeasuring.Units
                                    ? RegexPatterns.Money
                                    : RegexPatterns.Weight;

                                return regex.test(value) && Number(value) > 0
                            },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                mode="outlined"
                                label={t((formIngridient()?.serving.measuring === ProductMeasuring.Units) ? 'recipe.details.servingSizeInUnits' : 'recipe.details.servingSizeInGrams')}
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
                        formIngridient()?.product.pricing.measuring === ProductMeasuring.Units &&
                        <Controller
                            name={`ingridients.${index}.measuringType`}
                            defaultValue={selectedIngridient.serving.measuring}
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
            {errors.ingridients && errors.ingridients[index]?.selectedProduct && <Text style={styles.validationErrorLabel}>{t('validation.required.selectProduct')}</Text>}
            {errors.ingridients && errors.ingridients[index]?.units && <Text style={styles.validationErrorLabel}>{t('validation.required.decimalGTE', { gte: 0 })}</Text>}

            <ConfirmDeletionModal isVisible={visible} confirm={requestRemoval} dismiss={dismiss} />
        </View>
    );
}