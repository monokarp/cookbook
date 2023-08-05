import { Position, Recipe } from '@cookbook/domain/types/recipe/recipe';
import { createContext } from 'react';
import { create } from 'zustand';

export interface RecipeDetailsState {
    recipe: Recipe;
    addPosition: (value: Position) => void;
    setPosition: (value: Position, index: number) => void;
    removePosition: (index: number) => void;
}

export const RecipeDetailsContext = createContext<RecipeDetailsStore | null>(null);

export type RecipeDetailsStore = ReturnType<typeof createRecipeDetailsStore>;

export function createRecipeDetailsStore(defaultValue: Recipe) {
    return create<RecipeDetailsState>((set) => ({
        recipe: defaultValue,
        addPosition: (value: Position) => {
            set(state => {
                return {
                    recipe: new Recipe({
                        ...state.recipe,
                        positions: [...state.recipe.positions, value]
                    })
                };
            })
        },
        setPosition: (value: Position, index: number) => {
            set(state => {
                const copy = {
                    recipe: new Recipe({
                        ...state.recipe,
                        positions: [...state.recipe.positions]
                    })
                };

                copy.recipe.positions[index] = value;

                return copy;
            })
        },
        removePosition: (index: number) => set(state => ({
            recipe: new Recipe({
                ...state.recipe,
                positions: state.recipe.positions.filter((_, i) => i !== index)
            })
        }))
    }));
}