import { create } from 'zustand';
import { Product } from '../../../domain/types/product/product';

interface ProdctsStore {
    products: Product[];
    setProducts: (products: Product[]) => void;
}

export const useProductsStore = create<ProdctsStore>((set) => ({
    products: [],
    setProducts: (newProducts) => set(() => ({ products: newProducts })),
}));