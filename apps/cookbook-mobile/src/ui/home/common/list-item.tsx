import { useState } from "react";
import { View } from "react-native";
import { List, TouchableRipple } from "react-native-paper";
import { TestIds } from "../../test-ids.enum";
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
                testID={TestIds.ListItem}
                title={item.name}
                onPress={itemSelected}
                onLongPress={show}
                right={
                    props =>
                        <TouchableRipple style={{ padding: 15, paddingLeft: 0 }} onPress={exportRequested}>
                            <List.Icon {...props} icon="content-copy" />
                        </TouchableRipple>
                }
            />
            <ConfirmDeletionModal isVisible={visible} confirm={confirmDelete} dismiss={dismiss} />
        </View>
    );
}