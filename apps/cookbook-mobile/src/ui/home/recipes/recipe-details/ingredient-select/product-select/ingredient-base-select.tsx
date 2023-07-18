import { IngredientBase, isPrepack } from "@cookbook/domain/types/recipe/recipe";
import { FormatNumber } from "@cookbook/domain/util";
import { TestIds } from "@cookbook/ui/test-ids.enum";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, View } from "react-native";
import { Card, Dialog, Portal, Text, TextInput } from "react-native-paper";
import { usePrepacksStore } from "../../../../prepacks/prepacks.store";
import { useProductsStore } from "../../../../products/products.store";
import { useIngredientBaseStore } from "./ingredient-base.store";

export interface ProductSelectProps {
    selectedItem: IngredientBase | null,
    allowPrepacks: boolean,
    ingredientPrice: number,
    onSelect: (item: IngredientBase) => void,
    onLongPress?: () => void,
}

export function IngredientBaseSelect({ selectedItem, ingredientPrice, allowPrepacks, onSelect, onLongPress }: ProductSelectProps) {
    const { t } = useTranslation();

    const { items: products } = useProductsStore();
    const { items: prepacks } = usePrepacksStore();

    const [visible, setVisible] = useState(false);

    const { set, filteredItems, filter } = useIngredientBaseStore();

    useEffect(() => {
        set(allowPrepacks ? [...products, ...prepacks] : products);
    }, [products, prepacks, allowPrepacks]);

    const show = () => setVisible(true);

    const dismiss = () => {
        setVisible(false);
        filter('');
    }

    return (
        <View>
            <Pressable testID={TestIds.IngredientSelect.Ingredient.Button} onPress={show} onLongPress={onLongPress}>
                {
                    selectedItem?.id
                        ?
                        <Card>
                            <Card.Title testID={TestIds.IngredientSelect.Ingredient.Name} title={selectedItem.name} />
                            <Card.Content>
                                {isPrepack(selectedItem) && <Text variant="labelSmall">{t('recipe.details.isPrepack')}</Text>}
                                <Text testID={TestIds.IngredientSelect.Ingredient.Price} variant="labelSmall">{`${t('recipe.ingredientPrice')} ${FormatNumber.Money(ingredientPrice)}`}</Text>
                            </Card.Content>
                        </Card>
                        :
                        <Card style={{ height: '100%', justifyContent: 'center' }}>
                            <Card.Content>
                                <Text testID={TestIds.IngredientSelect.Ingredient.NamePlaceholder} variant="labelLarge">{t('product.search.noneSelected')}</Text>
                            </Card.Content>
                        </Card>
                }
            </Pressable>

            <Portal>
                <Dialog visible={visible} onDismiss={dismiss}>
                    <TextInput
                        testID={TestIds.IngredientSelect.Ingredient.Modal.NameSearchInput}
                        label={t('product.search.byName')}
                        onChange={
                            event => filter(event.nativeEvent.text)}
                    />
                    <Dialog.Content>
                        <FlatList
                            data={filteredItems}
                            renderItem={({ item, index }) =>
                                <Pressable
                                    testID={`${TestIds.IngredientSelect.Ingredient.Modal.ListItem}-${index}`}
                                    onTouchEnd={() => {
                                        onSelect(item);
                                        dismiss();
                                    }}>
                                    <Text style={{ padding: 20, fontWeight: '400', fontSize: 18 }}>{item.name}</Text>
                                </Pressable>
                            }
                            keyExtractor={product => product.id}
                        />
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </View>
    );
}