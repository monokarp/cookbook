import { TestIds } from "@cookbook/ui/test-ids";
import { useTranslation } from "react-i18next";
import { Portal, Snackbar, Text } from "react-native-paper";
import { useToast } from "./toast.store";
import { forwardRef, useImperativeHandle } from "react";

export const ToastMessage = forwardRef(_ToastMessage);

const DefaultTimeoutMs = 3000;

function _ToastMessage(_, ref) {
    const { t } = useTranslation();

    const { message, hide, show } = useToast();

    useImperativeHandle(ref, () => ({
        showToastMessage: (message: string, timeout = DefaultTimeoutMs) => {
            show(message);

            setTimeout(() => hide(), timeout);
        }
    }), [show, hide]);

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