import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text, TextInput } from 'react-native-paper';
import { RegexPatterns } from "../../../../../constants";
import { styles } from "../product-defails.style";
import { ProductDetailsFormData } from "../form-data-facade";


export function PricingByWeightForm() {
    const { t } = useTranslation();

    const { control, formState: { errors } } = useFormContext<ProductDetailsFormData>();

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
                name="weight"
            />
            {errors.weight && <Text style={styles.validationErrorLabel}>{t('validation.required.decimalGTE', { gte: 0 })}</Text>}

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
                name="price"
            />
            {errors.price && <Text style={styles.validationErrorLabel}>{t('validation.required.decimalGTE', { gte: 0 })}</Text>}
        </View>
    );
}