import { create } from 'zustand';
import { Recipe } from '../../../domain/types/recipe/recipe';

interface RecipesStore {
    recipes: Recipe[];
    filteredRecipes: Recipe[];
    setRecipes: (recipes: Recipe[]) => void;
    filter: (value: string) => void;
}

export const useRecipesStore = create<RecipesStore>((set) => ({
    recipes: [],
    filteredRecipes: [],
    setRecipes: (newRecipes) => set(() => ({ recipes: newRecipes, filteredRecipes: newRecipes })),
    filter: (value: string) => set((state) => ({ filteredRecipes: state.recipes.filter((recipe) => recipe.name.toLowerCase().includes(value.toLowerCase())) }))
}));