import { useTranslation } from "react-i18next";
import { Button, Dialog, Portal } from "react-native-paper";
import { TestIds } from "../../test-ids.enum";

export interface ConfirmDeletionModalProps {
    visible: boolean;
    confirm: () => void;
    dismiss: () => void;
}

export function ConfirmDeletionModal({ isVisible, confirm, dismiss }) {
    const { t } = useTranslation();

    return (
        <Portal>
            <Dialog testID={TestIds.ConfirmDeleteModal.Container} visible={isVisible} onDismiss={dismiss}>
                <Dialog.Title>{t('lists.deleteItemPrompt')}</Dialog.Title>
                <Dialog.Content>
                    <Dialog.Actions>
                        <Button testID={TestIds.ConfirmDeleteModal.Cancel} onPress={dismiss}>{t('common.cancel')}</Button>
                        <Button testID={TestIds.ConfirmDeleteModal.Confirm} onPress={confirm}>{t('common.yes')}</Button>
                    </Dialog.Actions>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
}