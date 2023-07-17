import { IngredientBase, isPrepack } from "@cookbook/domain/types/recipe/recipe";
import { FormatNumber } from "@cookbook/domain/util";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, View } from "react-native";
import { Card, Dialog, List, Portal, Text, TextInput } from "react-native-paper";
import { usePrepacksStore } from "../../../../prepacks/prepacks.store";
import { useProductsStore } from "../../../../products/products.store";
import { TestIds } from "@cookbook/ui/test-ids.enum";

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

    const itemList = () => allowPrepacks ? [...products, ...prepacks] : products;
    const [displayedItems, setDisplayedItems] = useState(itemList());

    const show = () => setVisible(true);

    const dismiss = () => {
        setVisible(false);
        setDisplayedItems(itemList());
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
                            event => {
                                const filteredItems = [...products, ...prepacks].filter(one => one.name.toLocaleLowerCase().includes(event.nativeEvent.text.toLocaleLowerCase()));

                                setDisplayedItems(filteredItems);
                            }}
                    />
                    <Dialog.Content>
                        <FlatList
                            data={displayedItems}
                            renderItem={info =>
                                <Pressable
                                    testID={TestIds.IngredientSelect.Ingredient.Modal.ListItem}
                                    onTouchEnd={() => {
                                        onSelect(info.item);
                                        dismiss();
                                    }}>
                                    <Text style={{ padding: 20, fontWeight: '400', fontSize: 18 }}>{info.item.name}</Text>
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