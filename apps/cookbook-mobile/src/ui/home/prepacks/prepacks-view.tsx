import { useInjection } from "inversify-react-native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { PrepackRepository } from "../../../core/repositories/prepack.repository";
import { RootViews } from "../../root-views.enum";
import { ExportToClipboard } from "../common/clipboard-export";
import { SummaryListItem } from "../common/list-item";
import { styles } from "../products/products-view.style";
import { useProductsStore } from "../products/products.store";
import { usePrepacksStore } from "./prepacks.store";

export function PrepacksView({ navigation }) {
    const { t } = useTranslation();
    const clipboardExport = new ExportToClipboard(t);

    const repo = useInjection(PrepackRepository);

    const { items: products } = useProductsStore();
    const { filteredItems: filteredPrepacks, set: setPrepacks, filter, deleteItem } = usePrepacksStore();

    useEffect(() => {
        repo.All().then(setPrepacks);
    }, [products]);

    return (
        <View style={styles.container}>
            <TextInput
                mode='outlined'
                label={t('product.search.byName')}
                defaultValue=''
                onChange={event => filter(event.nativeEvent.text)}
            />

            <View style={{ flex: 9 }}>
                <FlatList
                    data={filteredPrepacks}
                    renderItem={({ item }) =>
                        <View style={styles.item}>
                            <SummaryListItem
                                item={item}
                                itemSelected={() => navigation.navigate(RootViews.PrepackDetails, { prepack: item })}
                                deleteRequested={() => repo.Delete(item.id).then(() => deleteItem(item.id))}
                                exportRequested={() => clipboardExport.prepack(item)}
                            />
                        </View>
                    }
                    keyExtractor={product => product.id}
                />
            </View>

            <Button
                style={styles.button}
                mode='outlined'
                onPress={() => navigation.navigate(RootViews.PrepackDetails, { prepack: repo.Create() })}
            >
                <Text style={{ fontSize: 18 }}>{t('prepack.addNew')}</Text>
            </Button>
        </View>
    );
}