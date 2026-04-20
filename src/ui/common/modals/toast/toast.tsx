import { TestIds } from "@cookbook/ui/test-ids";
import { useTranslation } from "react-i18next";
import { Portal, Snackbar, Text } from "react-native-paper";

const DefaultTimeoutMs = 3000;

export interface ToastProps {
    message: string;
    onResult: () => void;
}

export function Toast({ message, onResult }: ToastProps) {
    const { t } = useTranslation();

    setTimeout(() => onResult(), DefaultTimeoutMs);

    return (
        <Portal>
            <Snackbar
                visible={!!message}
                onDismiss={onResult}
                action={{
                    onPress: onResult,
                    label: t('common.ok')
                }}
            >
                <Text style={{ color: 'white' }} testID={TestIds.PrepacksView.ToastMessage}>{message}</Text>
            </Snackbar>
        </Portal>
    );
}