import { TestIds } from "@cookbook/ui/test-ids";
import { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dialog, Portal } from "react-native-paper";
import { ConfirmationModalResult, useConfirmationModal } from "./confirmation.store";

export const Confirmation = forwardRef(_ConfirmationModal);

function _ConfirmationModal(_, ref) {
    const { t } = useTranslation();

    const { message, onClose, hide, show } = useConfirmationModal();

    function emitAction(result: ConfirmationModalResult) {
        onClose(result);
        hide();
    }

    useImperativeHandle(ref, () => ({ showConfirmationModal: show }), [show]);

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