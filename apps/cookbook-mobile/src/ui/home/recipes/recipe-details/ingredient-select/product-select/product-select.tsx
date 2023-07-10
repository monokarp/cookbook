import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, View } from "react-native";
import { Card, Dialog, List, Portal, Text, TextInput } from "react-native-paper";
import { Product } from "../../../../../../domain/types/product/product";
import { FormatNumber } from "../../../../../../domain/util";
import { useProductsStore } from "../../../../products/products.store";

export interface ProductSelectProps {
    selectedProduct: Product | null,
    ingredientPrice: number,
    onSelect: (product: Product) => void,
    onLongPress?: () => void,
}

export function ProductSelect({ selectedProduct, ingredientPrice, onSelect, onLongPress }: ProductSelectProps) {
    const { t } = useTranslation();

    const { products } = useProductsStore();

    const [visible, setVisible] = useState(false);
    const [displayedProducts, setDisplayedProducts] = useState(products);

    const show = () => setVisible(true);

    const dismiss = () => {
        setVisible(false);
        setDisplayedProducts(products);
    }

    return (
        <View>
            <Pressable onPress={show} onLongPress={onLongPress}>
                {
                    selectedProduct?.id
                        ?
                        <Card>
                            <Card.Title title={selectedProduct.name} />
                            <Card.Content>
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
                                const filteredProducts = products.filter(one => one.name.toLocaleLowerCase().includes(event.nativeEvent.text.toLocaleLowerCase()));

                                setDisplayedProducts(filteredProducts);
                            }}
                    />
                    <Dialog.Content>
                        <FlatList
                            data={displayedProducts}
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