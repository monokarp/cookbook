import { TestIds, collectionElementId } from "@cookbook/ui/test-ids";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable } from "react-native";
import { Dialog, Portal, TextInput, Text } from "react-native-paper";
import { useIngredientItemsStore, useIngredientSelectModal } from "./ingredient-select.store";
import { useProductsStore } from "../../../home/products/products.store";
import { usePrepacksStore } from "../../../home/prepacks/prepacks.store";
import { forwardRef, useEffect, useImperativeHandle } from "react";

export const IngredientSelect = forwardRef(_IngredientSelectModal);

function _IngredientSelectModal(_, ref) {
    const { t } = useTranslation();

    const { isVisible, showPrepacks, onSelect, hide, show } = useIngredientSelectModal();

    const { set, filteredItems, filter } = useIngredientItemsStore();

    const { items: products } = useProductsStore();
    const { items: prepacks } = usePrepacksStore();

    useEffect(() => {
        set(showPrepacks ? [...products, ...prepacks] : products);
    }, [products, prepacks, showPrepacks]);

    function resetAndDismiss() {
        filter('');
        hide();
    }

    useImperativeHandle(ref, () => ({ showIngredientSelectModal: show }), [show]);

    return (
        <Portal>
            <Dialog visible={isVisible} onDismiss={resetAndDismiss}>
                <TextInput
                    testID={TestIds.IngredientSelect.Ingredient.Modal.NameSearchInput}
                    label={t('product.search.byName')}
                    onChange={event => filter(event.nativeEvent.text)}
                />
                <Dialog.Content>
                    <FlatList
                        data={filteredItems}
                        renderItem={({ item, index }) =>
                            <Pressable
                                testID={collectionElementId(TestIds.IngredientSelect.Ingredient.Modal.ListItem, index)}
                                onTouchEnd={() => {
                                    onSelect(item);
                                    resetAndDismiss();
                                }}>
                                <Text style={{ padding: 20, fontWeight: '400', fontSize: 18 }}>{item.name}</Text>
                            </Pressable>
                        }
                        keyExtractor={item => item.id}
                    />
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
}