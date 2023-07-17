import { TestIds } from "@cookbook/ui/test-ids.enum";
import { useState } from "react";
import { Pressable, View, Text } from "react-native";
import { List, TouchableRipple } from "react-native-paper";
import { ConfirmDeletionModal } from "./confirmation-modal";
import { styles } from "./summary-list-item.style";

export interface SummaryListItemProps {
    item: { name: string };
    index: number;
    itemSelected: () => void;
    deleteRequested: () => void;
    exportRequested: () => void;
}

export function SummaryListItem({ item, itemSelected, deleteRequested, exportRequested, index }: SummaryListItemProps) {
    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const dismiss = () => setVisible(false);

    const confirmDelete = () => {
        dismiss();
        deleteRequested();
    };

    return (
        <View>
            <View style={styles.container}>
                <Pressable style={styles.textWrapper} onPress={itemSelected} onLongPress={show}>
                    <Text testID={`${TestIds.ListItem.Label}-${index}`} style={styles.text}>{item.name}</Text>
                </Pressable>
                <TouchableRipple testID={`${TestIds.ListItem.ClipboardExport}-${index}`} style={styles.button} onPress={exportRequested}>
                    <List.Icon icon="content-copy" />
                </TouchableRipple>
            </View>
            <ConfirmDeletionModal isVisible={visible} confirm={confirmDelete} dismiss={dismiss} />
        </View>
    );
}