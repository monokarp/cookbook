import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text, TextInput } from 'react-native-paper';
import { RegexPatterns } from "../../../../../constants";
import { FormatNumber, FormatString } from "../../../../../domain/util";
import { useUnsub } from "../../../../../ui/custom-hooks";
import { styles } from "../product-defails.style";
import { PricingFormProps } from "./props";
import { ProductMeasuring } from "../../../../../domain/types/product/product-pricing";
import { FormMode } from "../../../common/form-mode.enum";


export function PricingPerPieceForm({ pricing, onChange, mode }: PricingFormProps) {
    const { t } = useTranslation();
    const isEdit = mode === FormMode.Edit;

    const { control, watch, formState: { errors }, trigger } = useForm({
        defaultValues: {
            numberOfPieces: isEdit ? FormatNumber.Units(pricing.numberOfUnits) : '',
            gramsPerPiece: isEdit ? FormatNumber.Weight(pricing.numberOfUnits ? pricing.weightInGrams / pricing.numberOfUnits : 0) : '',
            totalPrice: isEdit ? FormatNumber.Money(pricing.price) : '',
        },
        mode: 'onTouched'
    });

    useUnsub(watch, (data) => {
        trigger().then(isValid => {
            if (isValid) {
                onChange({
                    measuring: ProductMeasuring.Units,
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
                    pattern: RegexPatterns.Money,
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