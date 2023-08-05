import { Prepack } from '@cookbook/domain/types/recipe/prepack';
import { ProductIngredient } from '@cookbook/domain/types/recipe/product-ingredient';
import { createContext } from 'react';
import { create } from 'zustand';

export interface PrepackDetailsState {
    prepack: Prepack;
    addIngredient: (value: ProductIngredient) => void;
    setIngredient: (value: ProductIngredient, index: number) => void;
    removeIngredient: (index: number) => void;
}

export const PrepackDetailsContext = createContext<PrepackDetailsStore | null>(null);

export type PrepackDetailsStore = ReturnType<typeof createPrepackDetailsStore>;

export function createPrepackDetailsStore(prepack: Prepack) {
    return create<PrepackDetailsState>((set) => ({
        prepack,
        addIngredient: (value: ProductIngredient) => {
            set(state => {
                return {
                    prepack: new Prepack({
                        ...state.prepack,
                        ingredients: [...state.prepack.ingredients, value]
                    })
                };
            })
        },
        setIngredient: (value: ProductIngredient, index: number) => {
            set(state => {
                const copy = {
                    prepack: new Prepack({
                        ...state.prepack,
                        ingredients: [...state.prepack.ingredients]
                    })
                };

                copy.prepack.ingredients[index] = value;

                return copy;
            })
        },
        removeIngredient: (index: number) => set(state => ({
            prepack: new Prepack({
                ...state.prepack,
                ingredients: state.prepack.ingredients.filter((_, i) => i !== index)
            })
        }))
    }));
}