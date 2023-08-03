import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";
import { IngredientBase, Position, isPrepack, isPrepackIngredient, isProductIngredient } from "@cookbook/domain/types/recipe/recipe";
import { FormatNumber } from "@cookbook/domain/util";
import { useContext, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Card, FAB, SegmentedButtons, Switch, Text, TextInput } from "react-native-paper";
import { Pressable, View } from "react-native";
import { TestIds, collectionElementId } from "@cookbook/ui/test-ids";
import { Product } from "@cookbook/domain/types/product/product";
import { Prepack } from "@cookbook/domain/types/recipe/prepack";
import { ModalsContext } from "../modals/modals.context";

export interface IngredientSelectProps {
    ingredient: Position,
    allowAddingPrepacks: boolean,
    index: number,
    requestRemoval: () => void,
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

export function SimpleIngredientSelect({ ingredient, index, requestRemoval, allowAddingPrepacks }: IngredientSelectProps) {
    console.log('ingredient select rendered')
    const { t } = useTranslation();

    const { ingredientSelect, confirmation } = useContext(ModalsContext);

    const { watch, trigger, getValues, formState: { errors } } = useFormContext();

    // @TODO !!base.id
    const [isEditMode, setEditMode] = useState(false);
    const toggleEdit = () => setEditMode(!isEditMode);

    const isMeasuredInUnits = isProductIngredient(ingredient) && ingredient.product.pricing.measuring === ProductMeasuring.Units;
    const isServedInUnits = isProductIngredient(ingredient) && ingredient.serving.measuring === ProductMeasuring.Units;
    const measuringUnits = isServedInUnits ? ingredient.units().toString() : FormatNumber.Weight(ingredient.units());
    const measuringType = t(isServedInUnits ? 'product.measuring.units' : 'product.measuring.grams');

    return (
        isEditMode
            ? <View style={{ margin: 5, backgroundColor: '#cccccc', borderRadius: 5 }}>
                <View style={{ padding: 15 }}>

                    <View style={{ flexDirection: 'row' }}>

                        <View style={{ flex: 4, flexDirection: 'row', flexWrap: 'wrap' }}>

                            <View style={{ width: '60%', flexDirection: 'column', justifyContent: 'center' }}>

                                <Pressable
                                    style={{ backgroundColor: 'pink' }}
                                    onPress={() => ingredientSelect(allowAddingPrepacks, e => console.log('selected ingredient', e))}
                                    onLongPress={() =>
                                        confirmation(
                                            t('lists.deleteItemPrompt'),
                                            (result) => {
                                                if (result === 'confirm') {
                                                    console.log('confirmed deletion')
                                                    // requestRemoval();
                                                }
                                            })}
                                >
                                    <Text variant="titleMedium">
                                        {getBase(ingredient).name} {isPrepack(getBase(ingredient)) ? t('recipe.details.isPrepack') : ''}
                                    </Text>

                                    <Text style={{}} variant="labelSmall">
                                        {`${t('recipe.ingredientPrice')} ${FormatNumber.Money(ingredient.price())}`}
                                    </Text>
                                </Pressable>

                            </View>

                            <View style={{ width: '40%', flexDirection: 'row', }}>

                                <TextInput
                                    style={{ flexGrow: 1 }}
                                    mode="flat"
                                    value={measuringUnits}
                                    label={measuringType}
                                >
                                </TextInput>

                                {
                                    isMeasuredInUnits &&
                                    <Switch
                                        testID={collectionElementId(TestIds.IngredientSelect.UnitsToggle, index)}
                                        value={isServedInUnits}
                                    />
                                }
                            </View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <FAB
                                icon={'check-bold'}
                                onPress={toggleEdit}
                            />
                        </View>

                    </View>
                </View>
            </View >

            : <View style={{ margin: 5, backgroundColor: '#cccccc', borderRadius: 5 }}>
                <View style={{ padding: 15 }}>

                    <View style={{ flexDirection: 'row' }}>

                        <View style={{ flex: 4, flexDirection: 'row', flexWrap: 'wrap' }}>

                            <View style={{ width: '60%', flexDirection: 'column', justifyContent: 'center' }}>
                                <Text variant="titleMedium">
                                    {getBase(ingredient).name} {isPrepack(getBase(ingredient)) ? t('recipe.details.isPrepack') : ''}
                                </Text>

                                <Text style={{}} variant="labelSmall">
                                    {`${t('recipe.ingredientPrice')} ${FormatNumber.Money(ingredient.price())}`}
                                </Text>
                            </View>

                            <View style={{ width: '40%', flexDirection: 'row', alignItems: 'center' }}>

                                <Text style={{ flexGrow: 1, fontSize: 16 }} variant="labelSmall" >
                                    {measuringUnits} {measuringType}
                                </Text>

                            </View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <FAB
                                icon={'file-edit'}
                                onPress={toggleEdit}
                            />
                        </View>

                    </View>
                </View>
            </View>
    );
}