import { TestIds, collectionElementId } from "@cookbook/ui/test-ids";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, KeyboardAvoidingView, View } from "react-native";
import { Divider, List, Modal, Portal, TextInput } from "react-native-paper";
import { usePrepacksStore } from "../../../home/prepacks/prepacks.store";
import { useProductsStore } from "../../../home/products/products.store";
import { useIngredientItemsStore, useIngredientSelectModal } from "./ingredient-select.store";

export const IngredientSelect = forwardRef(_IngredientSelectModal);

function _IngredientSelectModal(_, ref) {
    const { t } = useTranslation();

    console.log('rendering ingredient select')

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
            <Modal
                contentContainerStyle={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                    height: '50%',
                    marginVertical: 'auto',
                    marginHorizontal: '5%'
                }}
                visible={isVisible}
                onDismiss={resetAndDismiss}
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
                                    onSelect(item);
                                    resetAndDismiss();
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