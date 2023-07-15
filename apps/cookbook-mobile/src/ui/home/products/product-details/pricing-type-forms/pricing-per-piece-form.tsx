import { RegexPatterns } from "@cookbook/domain/constants";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text, TextInput } from 'react-native-paper';
import { TestIds } from "@cookbook/ui/test-ids.enum";
import { ProductDetailsFormData } from "../form-data-facade";
import { styles } from "../product-defails.style";


export function PricingPerPieceForm() {
    const { t } = useTranslation();

    const { formState: { errors } } = useFormContext<ProductDetailsFormData>();

    return (
        <View>
            <Text style={styles.inputLabel}>{t('product.details.numberOfPieces')}</Text>
            <Controller
                rules={{
                    required: true,
                    validate: (value) => RegexPatterns.Money.test(value) && Number(value) > 0,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        testID={TestIds.ProductDetails.UnitsInput}
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
                rules={{
                    required: true,
                    validate: (value) => RegexPatterns.Weight.test(value) && Number(value) > 0
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        testID={TestIds.ProductDetails.WeightInput}
                        style={styles.input}
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
                rules={{
                    required: true,
                    pattern: RegexPatterns.Money,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        testID={TestIds.ProductDetails.PriceInput}
                        style={styles.input}
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