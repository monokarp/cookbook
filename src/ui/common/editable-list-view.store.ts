import { createContext } from 'react';
import { create } from 'zustand';

export interface EditableListStore {
    hasItemsEditing: boolean;
    setItemsEditing: (value: boolean) => void;
}

export const PrepackDetailsContext = createContext<EditableListStore | null>(null);

export type PrepackDetailsStore = ReturnType<typeof createEditableListStore>;

export function createEditableListStore() {
    return create<EditableListStore>((set) => ({
        hasItemsEditing: false,
        setItemsEditing: (value: boolean) => set(state => ({ hasItemsEditing: value })),
    }));
}