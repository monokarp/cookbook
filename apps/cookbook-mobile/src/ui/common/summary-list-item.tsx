import { TestIds } from "@cookbook/ui/test-ids";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { List } from "react-native-paper";
import { IconResetTimeoutMs } from "../contsants";
import { useAppModals } from "./modals/modals.context";

export interface SummaryListItemProps {
    item: { name: string };
    itemTestId: string;
    index: number;
    itemSelected: () => void;
    deleteRequested: () => void;
    exportRequested: () => void;
}

enum Icons {
    Default = 'content-copy',
    Done = 'arrow-up',
}

export function SummaryListItem({ item, itemTestId, itemSelected, deleteRequested, exportRequested, index }: SummaryListItemProps) {
    const { t } = useTranslation();

    const { confirmation } = useAppModals();

    const [icon, setIcon] = useState(Icons.Default);

    function onExportPress() {
        setIcon(Icons.Done);

        setTimeout(() => setIcon(Icons.Default), IconResetTimeoutMs)

        exportRequested();
    }

    return (
        <List.Item
            testID={`${itemTestId}-${index}`}
            title={item.name}
            right={() =>
                <Pressable
                    testID={`${TestIds.ListItem.ClipboardExport}-${index}`}
                    onPress={onExportPress}
                >
                    <List.Icon icon={icon} />
                </Pressable>
            }
            onPress={itemSelected}
            onLongPress={() => {
                confirmation(
                    t('lists.deleteItemPrompt'),
                    (result) => {
                        if (result === 'confirm') {
                            deleteRequested();
                        }
                    }
                )
            }}
        />
    );
}