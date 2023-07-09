import { useTranslation } from "react-i18next";
import { Button, Dialog, Portal } from "react-native-paper";

export interface ConfirmDeletionModalProps {
    visible: boolean;
    confirm: () => void;
    dismiss: () => void;
}

export function ConfirmDeletionModal({ isVisible, confirm, dismiss }) {
    const { t } = useTranslation();

    return (
        <Portal>
            <Dialog visible={isVisible} onDismiss={dismiss}>
                <Dialog.Title>{t('lists.deleteItemPrompt')}</Dialog.Title>
                <Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={dismiss}>{t('common.cancel')}</Button>
                        <Button onPress={confirm}>{t('common.yes')}</Button>
                    </Dialog.Actions>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
}