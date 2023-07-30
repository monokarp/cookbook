import { TestIds } from "@cookbook/ui/test-ids";
import { useTranslation } from "react-i18next";
import { Button, Dialog, Portal } from "react-native-paper";
import { CloseModalResult, useConfirmationModal } from "./confirmation-modal.store";

export function ConfirmationModal() {
    const { t } = useTranslation();

    const { message, onClose, hide } = useConfirmationModal();

    function emitAction(result: CloseModalResult) {
        onClose(result);
        hide();
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