import { Ingridient } from "apps/cookbook-mobile/src/domain/types/recipe/ingridient";
import { withUnsub } from "apps/cookbook-mobile/src/ui/custom-hooks";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { styles } from "./ingridient-select.style";
import { ProductSelect } from "./product-select/product-select";
import { RegexPatterns } from "apps/cookbook-mobile/src/constants";
import { useState } from "react";

export interface IngridientSelectProps {
    selectedIngridient: Ingridient,
    onChange: (data: Ingridient) => void,
}

export function IngridientSelect({ selectedIngridient, onChange }: IngridientSelectProps) {
    const { t } = useTranslation();

    const [ingridient, setIngridient] = useState(selectedIngridient);

    const { control, watch, formState: { errors }, trigger } = useForm({
        defaultValues: {
            selectedProduct: ingridient.product,
            unitsPerServing: ingridient.unitsPerServing.toString()
        },
        mode: 'onChange'
    });

    withUnsub(watch, (data) => {
        trigger().then(isValid => {
            if (isValid) {
                const update = new Ingridient({
                    product: data.selectedProduct,
                    unitsPerServing: Number(data.unitsPerServing),
                });

                setIngridient(update);

                onChange(update);
            }
        });
    });

    return (
        <View>
            <View style={styles.container}>

                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.pickerWrapper}>
                            <ProductSelect
                                ingridientPrice={ingridient.price()}
                                selectedProduct={value}
                                onSelect={onChange}
                            />
                        </View>
                    )}
                    name="selectedProduct"
                />

                <Controller
                    control={control}
                    rules={{
                        required: true,
                        pattern: RegexPatterns.WeightDecimal,
                        min: 0
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label={t('recipe.details.servingSize')}
                            style={styles.servingSizeInput}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            keyboardType='numeric'
                            value={value}
                        />
                    )}
                    name="unitsPerServing"
                />

            </View>
            {errors.unitsPerServing && <Text style={styles.validationErrorLabel}>{t('validation.required.decimalGTE', { gte: 0 })}</Text>}
        </View>
    );
}