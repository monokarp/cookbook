import { TestIds } from "@cookbook/ui/test-ids";
import { useTranslation } from "react-i18next";
import { Portal, Snackbar, Text } from "react-native-paper";
import { useToast } from "./toast.store";

export function ToastMessage() {
    const { t } = useTranslation();

    const { message, hide } = useToast();

    return (
        <Portal>
            <Snackbar
                visible={!!message}
                onDismiss={() => hide()}
                action={{
                    label: t('common.ok')
                }}
            >
                <Text style={{ color: 'white' }} testID={TestIds.PrepacksView.ToastMessage}>{message}</Text>
            </Snackbar>
        </Portal>
    );
}