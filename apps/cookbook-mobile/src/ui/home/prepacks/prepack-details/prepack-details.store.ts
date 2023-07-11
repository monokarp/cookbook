import { create } from 'zustand';
import { Prepack } from '../../../../domain/types/recipe/prepack';
import { Ingredient } from '../../../../domain/types/recipe/ingredient';
import { createContext } from 'react';

export interface PrepackDetailsState {
    prepack: Prepack,
    setPrepack: (value: Prepack) => void
    addIngredient: (value: Ingredient) => void,
    removeIngredient: (index: number) => void
}

export const PrepackDetailsContext = createContext<PrepackDetailsStore | null>(null);

export type PrepackDetailsStore = ReturnType<typeof createPrepackDetailsStore>;

export function createPrepackDetailsStore(prepack: Prepack) {
    return create<PrepackDetailsState>((set) => ({
        prepack,
        setPrepack: (value: Prepack) => set({ prepack: value }),
        addIngredient: (value: Ingredient) => {
            console.log('adding ingredient')
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