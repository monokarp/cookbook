import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, View } from "react-native";
import { Card, Dialog, List, Portal, Text, TextInput, Button } from "react-native-paper";
import { useProductsStore } from "../../../../products/products.store";
import { Product } from "../../../../../../domain/types/product/product";
import { FormatNumber } from "../../../../../../domain/util";

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

    const dismiss = () => {
        setVisible(false);
        setDisplayedProducts(products);
    }

    return (
        <View>
            <Pressable onPress={show}>
                <Card style={{height:'100%'}}>
                    <Card.Title title={
                        selectedProduct
                            ? selectedProduct.name
                            : t('product.search.noneSelected')
                    } />
                    {
                        selectedProduct.id &&
                        <Card.Content>
                            <Text variant="labelSmall">{`${t('recipe.ingridientPrice')} ${FormatNumber.Money(ingridientPrice)}`}</Text>
                        </Card.Content>
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