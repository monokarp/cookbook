import { Picker } from "@react-native-picker/picker";
import { Product } from "apps/cookbook-mobile/src/domain/types/product/product";
import { Ingridient } from "apps/cookbook-mobile/src/domain/types/recipe/ingridient";
import { withUnsub } from "apps/cookbook-mobile/src/ui/custom-hooks";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { RegexPatterns } from "../../../products/product-details/util";
import { styles } from "./ingridient-select.style";

export interface IngridientSelectProps {
    selectedIngridient: Ingridient,
    allProducts: Product[];
    onChange: (data: Ingridient) => void,
}

export function IngridientSelect({ selectedIngridient, allProducts, onChange }: IngridientSelectProps) {
    const { t } = useTranslation();

    const { control, watch, formState: { errors }, trigger } = useForm({
        defaultValues: {
            selectedProductId: selectedIngridient.product.id,
            unitsPerServing: selectedIngridient.unitsPerServing.toString()
        },
        mode: 'onChange'
    });

    withUnsub(watch, (data) => {
        trigger().then(isValid => {
            if (isValid) {
                onChange(
                    new Ingridient(
                        allProducts.find(one => one.id == data.selectedProductId),
                        Number(data.unitsPerServing),
                    )
                );
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
                            <Picker
                                selectedValue={value}
                                onValueChange={onChange}>
                                {allProducts.map(one => <Picker.Item label={one.name} value={one.id} key={one.id} />)}
                            </Picker>
                        </View>
                    )}
                    name="selectedProductId"
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