import { RegexPatterns } from "apps/cookbook-mobile/src/constants";
import { withUnsub } from "apps/cookbook-mobile/src/ui/custom-hooks";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text, TextInput } from 'react-native-paper';
import { styles } from "../product-defails.style";
import { PricingFormProps } from "./props";
import { FormatNumber, FormatString } from "apps/cookbook-mobile/src/domain/util";


export function PricingByWeightForm({ pricing, onChange }: PricingFormProps) {
    const { t } = useTranslation();

    const { control, watch, formState: { errors }, trigger } = useForm({
        defaultValues: {
            totalGrams: FormatNumber.Weight(pricing.weightInGrams),
            totalPrice: FormatNumber.Money(pricing.price)
        },
        mode: 'onChange'
    });

    withUnsub(watch, (data) => {
        trigger().then(isValid => {
            if (isValid) {
                onChange({
                    measuring: pricing.measuring,
                    price: Number(data.totalPrice),
                    weightInGrams: FormatString.Weight(data.totalGrams),
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
                    validate: (value) => RegexPatterns.Weight.test(value) && Number(value) > 0,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        mode='outlined'
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
                    pattern: RegexPatterns.Money,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        mode='outlined'
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