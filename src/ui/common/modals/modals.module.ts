import { Container } from 'inversify';
import { ConfirmationModal } from './confirmation/confirmation.modal';
import { IngredientPickerModal } from './ingredient-picker/ingredient-picker.modal';
import { ModalService } from './modal.service';
import { ToastModal } from './toast/toast.modal';

export function RegisterModals(container: Container) {
    container.bind(ModalService).toSelf();

    container.bind(ConfirmationModal).toSelf();
    container.bind(ToastModal).toSelf();
    container.bind(IngredientPickerModal).toSelf();
}