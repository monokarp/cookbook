import { Position, PositionGroup, Recipe } from '@cookbook/domain/types/recipe/recipe';
import { createContext } from 'react';
import { create } from 'zustand';

export interface RecipeDetailsState {
    recipe: Recipe;
    addPosition: (value: Position) => void;
    setPosition: (value: Position, index: number) => void;
    removePosition: (index: number) => void;
    applyGroup: (group: PositionGroup) => void;
    removeGroup: (groupName: string) => void;
}

export const RecipeDetailsContext = createContext<RecipeDetailsStore | null>(null);

export type RecipeDetailsStore = ReturnType<typeof createRecipeDetailsStore>;

export function createRecipeDetailsStore(defaultValue: Recipe) {
    return create<RecipeDetailsState>((set) => ({
        recipe: defaultValue,
        addPosition: (value: Position) => {
            set(state => {
                state.recipe.addPosition(value);

                return {
                    recipe: state.recipe.clone()
                };
            })
        },
        setPosition: (value: Position, index: number) => {
            set(state => {
                state.recipe.setPosition(value, index);

                return {
                    recipe: state.recipe.clone()
                };
            })
        },
        removePosition: (index: number) => set(state => {
            state.recipe.removePosition(index);

            return {
                recipe: state.recipe.clone()
            };
        }),
        applyGroup: (group: PositionGroup) =>
            set(
                state => {
                    state.recipe.applyGroup(group);

                    return ({
                        recipe: state.recipe.clone()
                    });
                }
            ),
        removeGroup: (groupName: string) => set(state => {
            state.recipe.removeGroup(groupName);

            return {
                recipe: state.recipe.clone()
            };
        }),
    }));
}