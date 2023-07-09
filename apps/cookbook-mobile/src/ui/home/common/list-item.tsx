import { useState } from "react";
import { Pressable, View } from "react-native";
import { List } from "react-native-paper";
import { ConfirmDeletionModal } from "./confirmation-modal";

export interface SummaryListItemProps {
    item: { name: string };
    itemSelected: () => void;
    deleteRequested: () => void;
    exportRequested: () => void;
}

export function SummaryListItem({ item, itemSelected, deleteRequested, exportRequested }) {
    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const dismiss = () => setVisible(false);

    const confirmDelete = () => {
        dismiss();
        deleteRequested();
    };

    return (
        <View>
            <List.Item
                title={item.name}
                onPress={itemSelected}
                onLongPress={show}
                right={props => <Pressable onPress={exportRequested}><List.Icon {...props} icon="content-copy" /></Pressable>}
            />
            <ConfirmDeletionModal isVisible={visible} confirm={confirmDelete} dismiss={dismiss} />
        </View>
    );
}