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
        })),
        applyGroup: (group: PositionGroup) =>
            set(
                state => {
                    const prunedRecipeGroups = state.recipe.groups.reduce(
                        (groups, next) => {
                            const prunedIndices = next.positionIndices.filter(idx => !group.positionIndices.includes(idx));

                            if (prunedIndices.length) {
                                groups.push({
                                    ...next,
                                    positionIndices: prunedIndices
                                });
                            }

                            return groups;
                        }
                        , []);

                    const updatedGroupsLastIndex = group.positionIndices[group.positionIndices.length - 1];
                    const nextGroupIndex = state.recipe.groups.findIndex(existingGroup => existingGroup.positionIndices[0] > updatedGroupsLastIndex);

                    return ({
                        recipe: new Recipe({
                            ...state.recipe,
                            groups: nextGroupIndex === -1
                                ? [...prunedRecipeGroups, group]
                                : [
                                    ...prunedRecipeGroups.slice(0, nextGroupIndex),
                                    group,
                                    ...prunedRecipeGroups.slice(nextGroupIndex)
                                ]
                        })
                    });
                }
            ),
        removeGroup: (groupName: string) =>
            set(
                state => ({
                    recipe: new Recipe({
                        ...state.recipe,
                        groups: state.recipe.groups.filter(one => one.name !== groupName)
                    })
                })
            ),
    }));
}