import { Product } from "@cookbook/domain/types/product/product";
import { Prepack } from "@cookbook/domain/types/recipe/prepack";
import { TestIds, collectionElementId } from "@cookbook/ui/test-ids";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { Divider, List, Modal, Portal, TextInput } from "react-native-paper";
import { usePrepacksStore } from "../../../home/prepacks/prepacks.store";
import { useProductsStore } from "../../../home/products/products.store";
import { useIngredientItemsStore } from "./ingredient-picker.store";

export interface IngredientPickerProps {
    showPrepacks: boolean,
    onResult: (item: Product | Prepack | null) => void;
}

export function IngredientPicker({ showPrepacks, onResult }: IngredientPickerProps) {
    const { t } = useTranslation();

    const { set, filteredItems, filter } = useIngredientItemsStore();

    const { items: products } = useProductsStore();
    const { items: prepacks } = usePrepacksStore();

    useEffect(() => {
        set(showPrepacks ? [...products, ...prepacks] : products);
    }, [products, prepacks, showPrepacks]);

    function reset() { filter(''); }

    return (
        <Portal>
            <Modal
                contentContainerStyle={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                    height: '50%',
                    marginVertical: 'auto',
                    marginHorizontal: '5%'
                }}
                visible={!!filteredItems.length}
                onDismiss={() => {
                    reset();
                    onResult(null);
                }}
            >
                <TextInput
                    style={{ marginBottom: 5 }}
                    testID={TestIds.IngredientSelect.Ingredient.Modal.NameSearchInput}
                    label={t('product.search.byName')}
                    defaultValue=''
                    mode="outlined"
                    onChange={event => {
                        filter(event.nativeEvent.text);
                    }}
                />
                <FlatList
                    data={filteredItems}
                    renderItem={({ item, index }) =>
                        <View>
                            <List.Item
                                title={item.name}
                                testID={collectionElementId(TestIds.IngredientSelect.Ingredient.Modal.ListItem, index)}
                                onTouchEnd={() => {
                                    onResult(item);
                                    reset();
                                }}
                            />
                            <Divider />
                        </View>
                    }
                    keyExtractor={item => item.id}
                />
            </Modal>
        </Portal>
    );
}