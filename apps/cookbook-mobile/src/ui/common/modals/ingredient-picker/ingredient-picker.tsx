import { Prepack } from "@cookbook/domain/types/prepack/prepack";
import { Product } from "@cookbook/domain/types/product/product";
import { TestIds, collectionElementId } from "@cookbook/ui/test-ids";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { Divider, List, Modal, Portal, TextInput } from "react-native-paper";
import { useIngredientItemsStore } from "./ingredient-picker.store";

export interface IngredientPickerProps {
    items: (Product | Prepack)[],
    onResult: (item: Product | Prepack | null) => void;
}

export function IngredientPicker({ items, onResult }: IngredientPickerProps) {
    const { t } = useTranslation();

    const { set, filteredItems, filter } = useIngredientItemsStore();

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        set(items);
    }, [set, items]);

    function reset() {
        setVisible(false);
        filter('');
    }

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
                visible={visible}
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