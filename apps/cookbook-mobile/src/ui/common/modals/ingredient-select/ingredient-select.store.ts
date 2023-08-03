import { Product } from '@cookbook/domain/types/product/product';
import { Prepack } from '@cookbook/domain/types/recipe/prepack';
import { create } from 'zustand';
import { entityListStoreFactory } from '../../entity-list.store';

export type CloseModalResult = 'confirm' | 'cancel' | 'dismiss';
export type ModalResultHandler = (result: CloseModalResult) => void;

export interface IngredientSelectionModalStore {
    isVisible: boolean;
    showPrepacks: boolean;
    onSelect: (item: Product | Prepack) => void;
    show: (showPrepacks: boolean, onSelect: (item: Product | Prepack) => void) => void;
    hide: () => void;
}

export const useIngredientSelectModal = create<IngredientSelectionModalStore>((set) => ({
    isVisible: false,
    showPrepacks: false,
    onSelect: null,
    show: (showPrepacks, onSelect) => set(() => ({ isVisible: true, showPrepacks, onSelect })),
    hide: () => set(() => ({ isVisible: false, onSelect: null, onDismiss: null })),
}));

export const useIngredientItemsStore = entityListStoreFactory<Product | Prepack>();