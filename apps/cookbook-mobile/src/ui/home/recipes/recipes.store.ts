import { Recipe } from 'apps/cookbook-mobile/src/domain/types/recipe/recipe';
import { create } from 'zustand';

interface RecipesStore {
    recipes: Recipe[];
    setRecipes: (recipes: Recipe[]) => void;
}

export const useRecipesStore = create<RecipesStore>((set) => ({
    recipes: [],
    setRecipes: (newRecipes) => set(() => ({ recipes: newRecipes })),
}));