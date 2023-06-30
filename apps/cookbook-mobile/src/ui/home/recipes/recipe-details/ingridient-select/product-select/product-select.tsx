import { Product } from "apps/cookbook-mobile/src/domain/types/product/product";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, View } from "react-native";
import { Card, Dialog, List, Portal, TextInput } from "react-native-paper";
import { useProductsStore } from "../../../../products/products.store";

export interface ProductSelectProps {
    selectedProduct: Product | null,
    onSelect: (product: Product) => void,
}

export function ProductSelect({ selectedProduct, onSelect }: ProductSelectProps) {
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
                    {
                        selectedProduct
                            ? <Card.Title
                                title={selectedProduct.name}
                                subtitle={t('product.pricing.label', { pricePerGram: selectedProduct.pricePerGram() })}
                            />
                            : <Card.Title
                                title={t('product.search.noneSelected')}
                            />
                    }
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