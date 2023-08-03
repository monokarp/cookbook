import { TestIds } from "@cookbook/ui/test-ids";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { List, TouchableRipple } from "react-native-paper";
import { ModalsContext } from "./modals/modals.context";
import { styles } from "./summary-list-item.style";

export interface SummaryListItemProps {
    item: { name: string };
    itemTestId: string;
    index: number;
    itemSelected: () => void;
    deleteRequested: () => void;
    exportRequested: () => void;
}

export function SummaryListItem({ item, itemTestId, itemSelected, deleteRequested, exportRequested, index }: SummaryListItemProps) {
    const { t } = useTranslation();

    const { confirmation } = useContext(ModalsContext);

    return (
        <View>
            <View style={styles.container}>
                <Pressable style={styles.textWrapper} onPress={itemSelected} onLongPress={() => {
                    confirmation(
                        t('lists.deleteItemPrompt'),
                        (result) => {
                            if (result === 'confirm') {
                                deleteRequested();
                            }
                        }
                    )
                }}>
                    <Text testID={`${itemTestId}-${index}`} style={styles.text}>{item.name}</Text>
                </Pressable>
                <TouchableRipple testID={`${TestIds.ListItem.ClipboardExport}-${index}`} style={styles.button} onPress={exportRequested}>
                    <List.Icon icon="content-copy" />
                </TouchableRipple>
            </View>
        </View>
    );
}