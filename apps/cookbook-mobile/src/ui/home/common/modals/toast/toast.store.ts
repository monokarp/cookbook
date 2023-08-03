import { create } from 'zustand';

export interface ToastStore {
    message: string | null;
    show: (message: string) => void;
    hide: () => void;
}

export const useToast = create<ToastStore>((set) => ({
    message: null,
    show: (message: string) => set(() => ({ message })),
    hide: () => set(() => ({ message: null })),
}));

