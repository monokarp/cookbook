import { TestIds } from "@cookbook/ui/test-ids.enum";
import { useInjection } from "inversify-react-native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { PrepackRepository } from "../../../core/repositories/prepack.repository";
import { RootViews } from "../../root-views.enum";
import { ExportToClipboard } from "../common/clipboard-export";
import { SummaryListItem } from "../common/summary-list-item";
import { useToast } from "../common/toast/toast.store";
import { styles } from "../products/products-view.style";
import { useProductsStore } from "../products/products.store";
import { usePrepacksStore } from "./prepacks.store";

export function PrepacksView({ navigation }) {
    const { t } = useTranslation();
    const clipboardExport = new ExportToClipboard(t);

    const repo = useInjection(PrepackRepository);
    const { show, hide } = useToast();

    const { items: products } = useProductsStore();
    const { filteredItems: filteredPrepacks, set: setPrepacks, filter, deleteItem } = usePrepacksStore();

    useEffect(() => {
        repo.All().then(setPrepacks);
    }, [products]);

    const deletePrepack = async (id: string) => {
        try {
            await repo.Delete(id);

            deleteItem(id);
        } catch (e) {
            switch (e.code) {
                case 0: show(t('errors.prepack.fkViolation')); break;
                default: show(t('errors.prepack.cantDelete'));
            }

            setTimeout(() => hide(), 3000);
        }
    };

    return (
        <View testID={TestIds.PrepacksView.Container} style={styles.container}>
            <TextInput
                testID={TestIds.PrepacksView.SearchInput}
                mode='outlined'
                label={t('product.search.byName')}
                defaultValue=''
                onChange={event => filter(event.nativeEvent.text)}
            />

            <View style={{ flex: 9 }}>
                <FlatList
                    data={filteredPrepacks}
                    renderItem={({ item, index }) =>
                        <View style={styles.item}>
                            <SummaryListItem
                                item={item}
                                itemTestId={TestIds.PrepacksView.ListItem}
                                index={index}
                                itemSelected={() => navigation.navigate(RootViews.PrepackDetails, { prepack: item })}
                                deleteRequested={() => deletePrepack(item.id)}
                                exportRequested={() => clipboardExport.prepack(item)}
                            />
                        </View>
                    }
                    keyExtractor={product => product.id}
                />
            </View>

            <Button
                testID={TestIds.PrepacksView.AddNewButton}
                style={styles.button}
                mode='outlined'
                onPress={() => navigation.navigate(RootViews.PrepackDetails, { prepack: repo.Create() })}
            >
                <Text style={{ fontSize: 18 }}>{t('prepack.addNew')}</Text>
            </Button>
        </View>
    );
}