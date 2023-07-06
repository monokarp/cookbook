import { create } from 'zustand';
import { Recipe } from '../../../domain/types/recipe/recipe';

interface RecipesStore {
    recipes: Recipe[];
    setRecipes: (recipes: Recipe[]) => void;
}

export const useRecipesStore = create<RecipesStore>((set) => ({
    recipes: [],
    setRecipes: (newRecipes) => set(() => ({ recipes: newRecipes })),
}));