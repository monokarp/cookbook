import { RegexPatterns } from "@cookbook/domain/constants";
import { Product } from "@cookbook/domain/types/product/product";
import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";
import { Prepack } from "@cookbook/domain/types/recipe/prepack";
import { PrepackIngredient } from "@cookbook/domain/types/recipe/prepack-ingredient";
import { ProductIngredient } from "@cookbook/domain/types/recipe/product-ingredient";
import { IngredientBase, Position, isPrepack, isPrepackIngredient, isProduct, isProductIngredient } from "@cookbook/domain/types/recipe/recipe";
import { FormatNumber, FormatString } from "@cookbook/domain/util";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Card, FAB, Switch, Text, TextInput } from "react-native-paper";
import { useSubscription } from "../../../../custom-hooks";
import { styles } from "./ingredient-select.style";
import { IngredientBaseSelect } from "./product-select/ingredient-base-select";
import { TestIds, collectionElementId } from "@cookbook/ui/test-ids";
import { useConfirmationModal } from "../../../../common/modals/confirmation/confirmation.store";
import { useState } from "react";

export interface IngredientSelectProps {
    selectedIngredient: Position,
    allowAddingPrepacks: boolean,
    index: number,
    requestRemoval: () => void,
}

export interface IngredientFormData {
    selectedItem: IngredientBase,
    units: string,
    measuringType: string,
};

export function MapFormDataToIngredient(formData: IngredientFormData): Position {
    if (isProduct(formData.selectedItem)) {
        const measuring = formData.measuringType as ProductMeasuring ?? ProductMeasuring.Grams;
        const units = measuring === ProductMeasuring.Units ? Number(formData.units ?? '') : FormatString.Weight(formData.units ?? '');

        return new ProductIngredient({
            product: formData.selectedItem as Product,
            serving: {
                units,
                measuring
            }
        })
    }

    if (isPrepack(formData.selectedItem)) {
        return new PrepackIngredient({
            prepack: formData.selectedItem as Prepack,
            weightInGrams: FormatString.Weight(formData.units ?? ''),
        })
    }

    throw new Error('Unknown ingredient type');
}

function getBase(position: Position): IngredientBase {
    if (isProductIngredient(position)) {
        return position.product;
    }

    if (isPrepackIngredient(position)) {
        return position.prepack;
    }

    throw new Error('Unknown ingredient type');
}

export function IngredientSelect({ selectedIngredient, index, requestRemoval, allowAddingPrepacks }: IngredientSelectProps) {
    const { t } = useTranslation();

    const { show: showModal } = useConfirmationModal();

    const { watch, trigger, getValues, formState: { errors } } = useFormContext();

    const [isEditMode, setEditMode] = useState(true);
    const toggleEdit = () => setEditMode(!isEditMode);

    const ingredientBase = getBase(selectedIngredient);

    useSubscription(watch, () => trigger(`ingredients.${index}.units`));

    const getFormIngredient = (): Position => {
        if (!getValues().ingredients) { return selectedIngredient; }

        const formData: IngredientFormData = getValues().ingredients[index];

        if (!formData || !formData.selectedItem) { return selectedIngredient; }

        return MapFormDataToIngredient(formData);
    }

    const isFormIngredientServedInUnits = (): boolean => {
        const formIngredient = getFormIngredient();

        return isProductIngredient(formIngredient) && formIngredient.serving.measuring === ProductMeasuring.Units;
    };

    return (
        isEditMode
            ? <View>
                <View style={styles.container}>

                    <View style={styles.pickerWrapper}>
                        <Controller
                            name={`ingredients.${index}.selectedItem`}
                            defaultValue={getBase(selectedIngredient)}
                            rules={{
                                required: true,
                                validate: (value) => !!value.id,
                            }}
                            render={({ field: { onChange, value } }) => (
                                <IngredientBaseSelect
                                    index={index}
                                    allowPrepacks={allowAddingPrepacks}
                                    ingredientPrice={getFormIngredient().price()}
                                    selectedItem={value}
                                    onSelect={onChange}
                                    onLongPress={() =>
                                        showModal(
                                            t('lists.deleteItemPrompt'),
                                            (result) => {
                                                if (result === 'confirm') {
                                                    requestRemoval();
                                                }
                                            }
                                        )}
                                />
                            )}
                        />
                    </View>

                    <View style={styles.servingUnitsWrapper}>
                        <Controller
                            name={`ingredients.${index}.units`}
                            rules={{
                                required: true,
                                validate: (value) => {
                                    const regex = isFormIngredientServedInUnits()
                                        ? RegexPatterns.Money
                                        : RegexPatterns.Weight;

                                    return regex.test(value) && Number(value) > 0
                                },
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    testID={collectionElementId(TestIds.IngredientSelect.UnitsInput, index)}
                                    mode="outlined"
                                    label={t(isFormIngredientServedInUnits() ? 'recipe.details.servingSizeInUnits' : 'recipe.details.servingSizeInGrams')}
                                    style={styles.servingSizeInput}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    keyboardType='numeric'
                                    value={value}
                                />
                            )}
                        />
                    </View>

                    <View style={styles.servingMeasureWrapper}>
                        {
                            isProductIngredient(selectedIngredient) && selectedIngredient.product.pricing.measuring === ProductMeasuring.Units &&
                            <Controller
                                name={`ingredients.${index}.measuringType`}
                                render={({ field: { onChange, value } }) => (
                                    <Switch
                                        testID={collectionElementId(TestIds.IngredientSelect.UnitsToggle, index)}
                                        value={value === ProductMeasuring.Units}
                                        onValueChange={value => {
                                            onChange(value ? ProductMeasuring.Units : ProductMeasuring.Grams);
                                        }}
                                    />
                                )}
                            />
                        }
                    </View>
                </View>
                {
                    errors.ingredients && errors.ingredients[index]?.selectedProduct &&
                    <Text testID={collectionElementId(TestIds.IngredientSelect.Ingredient.RequiredError, index)} style={styles.validationErrorLabel}>{t('validation.required.selectProduct')}</Text>
                }
                {
                    errors.ingredients && errors.ingredients[index]?.units &&
                    <Text testID={collectionElementId(TestIds.IngredientSelect.Ingredient.UnitsError, index)} style={styles.validationErrorLabel}>{t('validation.required.decimalGTE', { gte: 0 })}</Text>
                }
            </View>
            :
            <Card style={{ margin: 5 }}>
                <Card.Title
                    title={ingredientBase.name}
                />
                <Card.Content>
                    {
                        isPrepack(ingredientBase) &&
                        <Text
                            variant="labelSmall"
                        >
                            {t('recipe.details.isPrepack')}
                        </Text>
                    }
                    <Text>{selectedIngredient.units()}</Text>
                    <Text>{t(isFormIngredientServedInUnits() ? 'recipe.details.servingSizeInUnits' : 'recipe.details.servingSizeInGrams')}</Text>
                    <Text
                        variant="labelSmall"
                    >
                        {`${t('recipe.ingredientPrice')} ${FormatNumber.Money(getFormIngredient().price())}`}
                    </Text>
                </Card.Content>
                <Card.Actions>
                    <FAB icon="file-edit" />
                </Card.Actions>
            </Card>
    );
}