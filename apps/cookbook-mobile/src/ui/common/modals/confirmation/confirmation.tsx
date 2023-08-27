import { TestIds } from "@cookbook/ui/test-ids";
import { useTranslation } from "react-i18next";
import { Button, Dialog, Portal } from "react-native-paper";

export type ConfirmationResult = 'confirm' | 'cancel' | 'dismiss';

export interface ConfirmationProps {
    message: string;
    onResult: (type: ConfirmationResult) => void;
}

export function Confirmation({ message, onResult }: ConfirmationProps) {
    const { t } = useTranslation();

    function emitAction(result: ConfirmationResult) {
        onResult(result);
    }

    return (
        <Portal>
            <Dialog
                testID={TestIds.ConfirmDeleteModal.Container}
                visible={!!message}
                onDismiss={() => emitAction('dismiss')}
            >
                <Dialog.Title>{message}</Dialog.Title>
                <Dialog.Content>
                    <Dialog.Actions>
                        <Button testID={TestIds.ConfirmDeleteModal.Cancel} onPress={() => emitAction('cancel')}>{t('common.cancel')}</Button>
                        <Button testID={TestIds.ConfirmDeleteModal.Confirm} onPress={() => emitAction('confirm')}>{t('common.yes')}</Button>
                    </Dialog.Actions>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
}