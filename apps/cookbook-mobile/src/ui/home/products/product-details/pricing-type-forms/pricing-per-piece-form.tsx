import { PricedPerPieceDto } from "apps/cookbook-mobile/src/domain/types/product/product-pricing/per-piece";
import { withUnsub } from "apps/cookbook-mobile/src/ui/custom-hooks";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text, TextInput } from 'react-native-paper';
import { styles } from "../product-defails.style";
import { RegexPatterns } from "../util";

export interface PricingPerPieceFormProps {
    pricing: PricedPerPieceDto;
    onChange: (formData: PricedPerPieceDto) => void
}

export function PricingPerPieceForm({ pricing, onChange }: PricingPerPieceFormProps) {
    const { t } = useTranslation();

    const { control, watch, formState: { errors }, trigger } = useForm({
        defaultValues: {
            numberOfPieces: pricing.numberOfPieces?.toString(),
            gramsPerPiece: pricing.gramsPerPiece?.toString(),
            totalPrice: pricing.totalPrice?.toString()
        },
        mode: 'onChange'
    });

    withUnsub(watch, (data) => {
        trigger().then(isValid => {
            if (isValid) {
                onChange({
                    totalPrice: Number(data.totalPrice),
                    numberOfPieces: Number(data.numberOfPieces),
                    gramsPerPiece: Number(data.gramsPerPiece),
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

            <Text style={styles.inputLabel}>{t('product.details.weightPerPiece')}</Text>
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