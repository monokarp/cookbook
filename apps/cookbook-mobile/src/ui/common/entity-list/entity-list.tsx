import { FlatList, View } from "react-native";
import { styles } from "./entity-list.style";
import { SummaryListItem } from "../summary-list-item";
import { Button, Divider, Text } from "react-native-paper";
import { NamedEntity } from "@cookbook/domain/types/named-entity";
import { useTranslation } from "react-i18next";

export interface EntityListProps<E extends NamedEntity> {
    items: E[],
    itemTestId: string,
    addNewButtonTestId: string,
    select: (item: E) => void,
    addNew: () => void,
    remove: (item: E) => void,
    exportToClipboard: (item: E) => void,
}

export function EntityList<E extends NamedEntity>({ items, itemTestId, addNewButtonTestId, select, addNew, remove, exportToClipboard }: EntityListProps<E>) {
    const { t } = useTranslation();

    return (
        <View style={{ flexGrow: 1 }}>
            <FlatList
                style={styles.list}
                data={items}
                renderItem={({ item, index }) =>
                    <View>
                        <SummaryListItem
                            item={item}
                            itemTestId={itemTestId}
                            index={index}
                            itemSelected={() => select(item)}
                            deleteRequested={() => remove(item)}
                            exportRequested={() => exportToClipboard(item)}
                        />
                        <Divider />
                    </View>
                }
                keyExtractor={item => item.id}
            />

            <Button
                testID={addNewButtonTestId}
                style={styles.button}
                mode='contained-tonal'
                onPress={addNew}
            >
                <Text style={{ fontSize: 18 }}>{t('prepack.addNew')}</Text>
            </Button>
        </View>
    );
};