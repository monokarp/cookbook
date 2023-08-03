import { create } from 'zustand';

export type ConfirmationModalResult = 'confirm' | 'cancel' | 'dismiss';
export type ConfirmationModalResultHandler = (result: ConfirmationModalResult) => void;

export interface ConfirmationModalStore {
    message: string | null;
    onClose: ConfirmationModalResultHandler | null;
    show: (message: string, onClose: ConfirmationModalResultHandler) => void;
    hide: () => void;
}

export const useConfirmationModal = create<ConfirmationModalStore>((set) => ({
    message: null,
    onClose: null,
    show: (message, onClose) => set(() => ({ message, onClose })),
    hide: () => set(() => ({ message: null, onClose: null })),
}));

