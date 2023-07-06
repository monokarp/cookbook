import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text, TextInput } from 'react-native-paper';
import { RegexPatterns } from "../../../../../constants";
import { FormatNumber, FormatString } from "../../../../../domain/util";
import { useUnsub } from "../../../../../ui/custom-hooks";
import { styles } from "../product-defails.style";
import { PricingFormProps } from "./props";


export function PricingPerPieceForm({ pricing, onChange }: PricingFormProps) {
    const { t } = useTranslation();

    const { control, watch, formState: { errors }, trigger } = useForm({
        defaultValues: {
            numberOfPieces: FormatNumber.Units(pricing.numberOfUnits),
            gramsPerPiece: FormatNumber.Weight(pricing.weightInGrams / pricing.numberOfUnits),
            totalPrice: FormatNumber.Money(pricing.price)
        },
        mode: 'onChange'
    });

    useUnsub(watch, (data) => {
        trigger().then(isValid => {
            if (isValid) {
                onChange({
                    measuring: pricing.measuring,
                    price: Number(data.totalPrice),
                    numberOfUnits: Number(data.numberOfPieces),
                    weightInGrams: Number(data.numberOfPieces) * FormatString.Weight(data.gramsPerPiece),
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
                    validate: (value) => RegexPatterns.Money.test(value) && Number(value) > 0,
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
                    validate: (value) => RegexPatterns.Weight.test(value) && Number(value) > 0
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
                    validate: (value) => RegexPatterns.Money.test(value) && Number(value) > 0,
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