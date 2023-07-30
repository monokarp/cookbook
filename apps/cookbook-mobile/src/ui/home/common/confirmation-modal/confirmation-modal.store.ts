import { create } from 'zustand';

export type CloseModalResult = 'confirm' | 'cancel' | 'dismiss';
export type ModalResultHandler = (result: CloseModalResult) => void;

export interface ConfirmationModalStore {
    message: string | null;
    onClose: ModalResultHandler | null;
    showModal: (message: string, onClose: ModalResultHandler) => void;
    hide: () => void;
}

export const useConfirmationModal = create<ConfirmationModalStore>((set) => ({
    message: null,
    onClose: null,
    showModal: (message, onClose) => set(() => ({ message, onClose })),
    hide: () => set(() => ({ message: null, onClose: null })),
}));

