import { RegexPatterns } from "apps/cookbook-mobile/src/constants";
import { withUnsub } from "apps/cookbook-mobile/src/ui/custom-hooks";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text, TextInput } from 'react-native-paper';
import { styles } from "../product-defails.style";
import { PricingFormProps } from "./props";


export function PricingByWeightForm({ pricing, onChange }: PricingFormProps) {
    const { t } = useTranslation();

    const { control, watch, formState: { errors }, trigger } = useForm({
        defaultValues: {
            totalGrams: pricing.totalWeight?.toString(),
            totalPrice: pricing.totalPrice?.toString()
        },
        mode: 'onChange'
    });

    withUnsub(watch, (data) => {
        trigger().then(isValid => {
            if (isValid) {
                onChange({
                    pricingType: pricing.pricingType,
                    totalPrice: Number(data.totalPrice),
                    totalWeight: Number(data.totalGrams),
                    numberOfUnits: 1,
                });
            }
        });
    });

    return (
        <View>
            <Text style={styles.inputLabel}>{t('product.details.totalWeight')}</Text>
            <Controller
                control={control}
                rules={{
                    required: true,
                    pattern: RegexPatterns.WeightDecimal,
                    min: 0
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType='numeric'
                        value={value}
                    />
                )}
                name="totalGrams"
            />
            {errors.totalGrams && <Text style={styles.validationErrorLabel}>{t('validation.required.decimalGTE', { gte: 0 })}</Text>}

            <Text style={styles.inputLabel}>{t('product.pricing.totalPrice')}</Text>
            <Controller
                control={control}
                rules={{
                    required: true,
                    pattern: RegexPatterns.WeightDecimal,
                    min: 0
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType='numeric'
                        value={value}
                    />
                )}
                name="totalPrice"
            />
            {errors.totalPrice && <Text style={styles.validationErrorLabel}>{t('validation.required.decimalGTE', { gte: 0 })}</Text>}
        </View>
    );
}