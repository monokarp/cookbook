import { Product } from "apps/cookbook-mobile/src/domain/types/product/product";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, View } from "react-native";
import { Card, Dialog, List, Portal, TextInput, Text } from "react-native-paper";
import { useProductsStore } from "../../../../products/products.store";

export interface ProductSelectProps {
    selectedProduct: Product | null,
    ingridientPrice: number,
    onSelect: (product: Product) => void,
}

export function ProductSelect({ selectedProduct, ingridientPrice, onSelect }: ProductSelectProps) {
    const { t } = useTranslation();

    const { products } = useProductsStore();

    const [visible, setVisible] = useState(false);
    const [displayedProducts, setDisplayedProducts] = useState(products);

    const show = () => setVisible(true);
    const dismiss = () => setVisible(false);

    return (
        <View>
            <Pressable onPress={show}>
                <Card>
                    <Card.Title title={
                        selectedProduct
                            ? selectedProduct.name
                            : t('product.search.noneSelected')
                    } />
                    <Card.Content>
                        <Text variant="labelSmall">{t('product.pricing.label', { pricePerGram: selectedProduct.pricing.pricePerGram() })}</Text>
                        <Text variant="labelSmall">{`${t('recipe.ingridientPrice')} ${ingridientPrice}`}</Text>
                    </Card.Content>
                </Card>
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
                                <Pressable onPress={() => { onSelect(info.item); dismiss(); }}>
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