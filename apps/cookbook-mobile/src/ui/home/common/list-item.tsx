import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { Button, Dialog, List, Portal } from "react-native-paper";

export interface SummaryListItemProps {
    item: { name: string };
    itemSelected: () => void;
    deleteRequested: () => void;
    exportRequested: () => void;
}

export function SummaryListItem({ item, itemSelected, deleteRequested, exportRequested }) {
    const { t } = useTranslation();

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
            <Portal>
                <Dialog visible={visible} onDismiss={dismiss}>
                    <Dialog.Title>Delete this item?</Dialog.Title>
                    <Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={dismiss}>Cancel</Button>
                            <Button onPress={confirmDelete}>Yes</Button>
                        </Dialog.Actions>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </View>
    );
}