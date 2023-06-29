import { Product } from 'apps/cookbook-mobile/src/domain/types/product/product';
import { Recipe } from 'apps/cookbook-mobile/src/domain/types/recipe/recipe';
import { create } from 'zustand';

interface RecipesStore {
    recipes: Recipe[];
    products: Product[];
    setRecipes: (recipes: Recipe[]) => void;
    setProducts: (products: Product[]) => void;
}

export const useRecipesStore = create<RecipesStore>((set) => ({
    recipes: [],
    products: [],
    setRecipes: (newRecipes) => set(() => ({ recipes: newRecipes })),
    setProducts: (newProducts) => set(() => ({ products: newProducts })),
}));