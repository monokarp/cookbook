import { RegexPatterns } from "@cookbook/domain/constants";
import { TestIds } from "@cookbook/ui/test-ids";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text, TextInput } from 'react-native-paper';
import { ProductDetailsFormData } from "../form-data-facade";
import { styles } from "../product-defails.style";


export function PricingByWeightForm() {
    const { t } = useTranslation();

    const { formState: { errors } } = useFormContext<ProductDetailsFormData>();

    return (
        <View>
            <Text style={styles.inputLabel}>{t('product.details.totalWeight')}</Text>
            <Controller
                rules={{
                    required: true,
                    validate: (value) => RegexPatterns.Weight.test(value) && Number(value) > 0,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        testID={TestIds.ProductDetails.WeightInput}
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
            {
                errors.weight &&
                <Text
                    testID={TestIds.ProductDetails.WeightInputError}
                    style={styles.validationErrorLabel}
                >
                    {t('validation.required.decimalGTE', { gte: 0 })}
                </Text>
            }

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
                        mode='outlined'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType='numeric'
                        value={value}
                    />
                )}
                name="price"
            />
            {
                errors.price &&
                <Text
                    testID={TestIds.ProductDetails.PriceInputError}
                    style={styles.validationErrorLabel}
                >
                    {t('validation.required.decimalGTE', { gte: 0 })}
                </Text>
            }
        </View>
    );
}