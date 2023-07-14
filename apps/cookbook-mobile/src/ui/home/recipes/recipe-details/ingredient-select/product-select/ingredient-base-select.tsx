import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, View } from "react-native";
import { Avatar, Card, Dialog, List, Portal, Text, TextInput } from "react-native-paper";
import { IngredientBase, isPrepack } from "../../../../../../domain/types/recipe/recipe";
import { FormatNumber } from "../../../../../../domain/util";
import { usePrepacksStore } from "../../../../prepacks/prepacks.store";
import { useProductsStore } from "../../../../products/products.store";

export interface ProductSelectProps {
    selectedItem: IngredientBase | null,
    ingredientPrice: number,
    onSelect: (item: IngredientBase) => void,
    onLongPress?: () => void,
}

export function IngredientBaseSelect({ selectedItem, ingredientPrice, onSelect, onLongPress }: ProductSelectProps) {
    const { t } = useTranslation();

    const { items: products } = useProductsStore();
    const { items: prepacks } = usePrepacksStore();

    const [visible, setVisible] = useState(false);
    const [displayedItems, setDisplayedItems] = useState([...products, ...prepacks]);

    const show = () => setVisible(true);

    const dismiss = () => {
        setVisible(false);
        setDisplayedItems([...products, ...prepacks]);
    }

    return (
        <View>
            <Pressable onPress={show} onLongPress={onLongPress}>
                {
                    selectedItem?.id
                        ?
                        <Card>
                            <Card.Title title={selectedItem.name} />
                            <Card.Content>
                                {isPrepack(selectedItem) && <Text variant="labelSmall">{t('recipe.details.isPrepack')}</Text>}
                                <Text variant="labelSmall">{`${t('recipe.ingredientPrice')} ${FormatNumber.Money(ingredientPrice)}`}</Text>
                            </Card.Content>
                        </Card>
                        :
                        <Card style={{ height: '100%', justifyContent: 'center' }}>
                            <Card.Content>
                                <Text variant="labelLarge">{t('product.search.noneSelected')}</Text>
                            </Card.Content>
                        </Card>
                }
            </Pressable>

            <Portal>
                <Dialog visible={visible} onDismiss={dismiss}>
                    <TextInput
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
                                    onTouchEnd={() => {
                                        onSelect(info.item);
                                        dismiss();
                                    }}>
                                    <List.Item title={info.item.name} />
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