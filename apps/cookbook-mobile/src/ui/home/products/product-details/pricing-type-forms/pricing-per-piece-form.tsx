import { RegexPatterns } from "apps/cookbook-mobile/src/constants";
import { withUnsub } from "apps/cookbook-mobile/src/ui/custom-hooks";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text, TextInput } from 'react-native-paper';
import { styles } from "../product-defails.style";
import { PricingFormProps } from "./props";


export function PricingPerPieceForm({ pricing, onChange }: PricingFormProps) {
    const { t } = useTranslation();

    const { control, watch, formState: { errors }, trigger } = useForm({
        defaultValues: {
            numberOfPieces: pricing.numberOfUnits?.toString(),
            gramsPerPiece: (pricing.weightInGrams ? pricing.weightInGrams / pricing.numberOfUnits : 0).toString(),
            totalPrice: pricing.price?.toString()
        },
        mode: 'onChange'
    });

    withUnsub(watch, (data) => {
        trigger().then(isValid => {
            if (isValid) {
                onChange({
                    measuring: pricing.measuring,
                    price: Number(data.totalPrice),
                    numberOfUnits: Number(data.numberOfPieces),
                    weightInGrams: Number(data.numberOfPieces) * Number(data.gramsPerPiece),
                });
            }
        });
    });

    return (
        <View>
            <Text style={styles.inputLabel}>{t('product.details.numberOfPieces')}</Text>
            <Controller
                control={control}
                rules={{
                    required: true,
                    pattern: RegexPatterns.Integer,
                    min: 1
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
                name="numberOfPieces"
            />
            {errors.numberOfPieces && <Text style={styles.validationErrorLabel}>{t('validation.required.integerGTE', { gte: 1 })}</Text>}

            <Text style={styles.inputLabel}>{t('product.details.gramsPerPiece')}</Text>
            <Controller
                control={control}
                rules={{
                    required: true,
                    pattern: RegexPatterns.WeightDecimal,
                    min: 1
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
                name="gramsPerPiece"
            />
            {errors.gramsPerPiece && <Text style={styles.validationErrorLabel}>{t('validation.required.decimalGTE', { gte: 0 })}</Text>}

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