import { IngredientBase, isPrepack } from "@cookbook/domain/types/recipe/recipe";
import { FormatNumber } from "@cookbook/domain/util";
import { TestIds, collectionElementId } from "@cookbook/ui/test-ids";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { ModalsContext } from "../../../../../common/modals/modals.context";

export interface ProductSelectProps {
    selectedItem: IngredientBase | null,
    index: number,
    allowPrepacks: boolean,
    ingredientPrice: number,
    onSelect: (item: IngredientBase) => void,
    onLongPress?: () => void,
}

export function IngredientBaseSelect({ selectedItem, index, ingredientPrice, allowPrepacks, onSelect, onLongPress }: ProductSelectProps) {
    const { t } = useTranslation();

    const { ingredientSelect } = useContext(ModalsContext);

    return (
        <View>
            <Pressable
                testID={collectionElementId(TestIds.IngredientSelect.Ingredient.Button, index)}
                onPress={() => ingredientSelect(allowPrepacks, onSelect)}
                onLongPress={onLongPress}
            >
                {
                    selectedItem?.id
                        ?
                        <Card>
                            <Card.Title
                                testID={collectionElementId(TestIds.IngredientSelect.Ingredient.Name, index)}
                                title={selectedItem.name}
                            />
                            <Card.Content>
                                {
                                    isPrepack(selectedItem) &&
                                    <Text
                                        testID={collectionElementId(TestIds.IngredientSelect.Ingredient.IsPrepackLabel, index)}
                                        variant="labelSmall"
                                    >
                                        {t('recipe.details.isPrepack')}
                                    </Text>
                                }
                                <Text
                                    testID={collectionElementId(TestIds.IngredientSelect.Ingredient.Price, index)}
                                    variant="labelSmall"
                                >
                                    {`${t('recipe.ingredientPrice')} ${FormatNumber.Money(ingredientPrice)}`}
                                </Text>
                            </Card.Content>
                        </Card>
                        :
                        <Card style={{ height: '100%', justifyContent: 'center' }}>
                            <Card.Content>
                                <Text
                                    testID={TestIds.IngredientSelect.Ingredient.NamePlaceholder}
                                    variant="labelLarge"
                                >
                                    {t('product.search.noneSelected')}
                                </Text>
                            </Card.Content>
                        </Card>
                }
            </Pressable>
        </View>
    );
}