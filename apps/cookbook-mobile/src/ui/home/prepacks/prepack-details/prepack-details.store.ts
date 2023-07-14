import { create } from 'zustand';
import { Prepack } from '../../../../domain/types/recipe/prepack';
import { ProductIngredient } from '../../../../domain/types/recipe/product-ingredient';
import { createContext } from 'react';

export interface PrepackDetailsState {
    prepack: Prepack,
    setPrepack: (value: Prepack) => void
    addIngredient: (value: ProductIngredient) => void,
    removeIngredient: (index: number) => void
}

export const PrepackDetailsContext = createContext<PrepackDetailsStore | null>(null);

export type PrepackDetailsStore = ReturnType<typeof createPrepackDetailsStore>;

export function createPrepackDetailsStore(prepack: Prepack) {
    return create<PrepackDetailsState>((set) => ({
        prepack,
        setPrepack: (value: Prepack) => set({ prepack: value }),
        addIngredient: (value: ProductIngredient) => {
            set(state => ({
                prepack: new Prepack({
                    ...state.prepack,
                    ingredients: [...state.prepack.ingredients, value]
                })
            }))
        },
        removeIngredient: (index: number) => set(state => ({
            prepack: new Prepack({
                ...state.prepack,
                ingredients: state.prepack.ingredients.filter((_, i) => i !== index)
            })
        }))
    }));
}