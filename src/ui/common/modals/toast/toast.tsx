import { TestIds } from "@cookbook/ui/test-ids";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Portal, Snackbar, Text } from "react-native-paper";

const DefaultTimeoutMs = 3000;

export interface ToastProps {
    message: string;
    testID?: string;
    onResult: () => void;
}

export function Toast({ message, testID, onResult }: ToastProps) {
    const { t } = useTranslation();

    useEffect(() => {
        const handle = setTimeout(() => onResult(), DefaultTimeoutMs);
        return () => clearTimeout(handle);
    }, []);

    return (
        <Portal>
            <Snackbar
                visible={!!message}
                onDismiss={onResult}
                action={{
                    onPress: onResult,
                    label: t("common.ok"),
                }}
            >
                <Text style={{ color: "white" }} testID={testID ?? TestIds.Common.ToastMessage}>
                    {message}
                </Text>
            </Snackbar>
        </Portal>
    );
}
