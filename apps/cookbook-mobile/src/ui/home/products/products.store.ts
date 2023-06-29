import { Product } from '../../../domain/types/product/product';
import { create } from 'zustand';

interface ProdctsStore {
    products: Product[];
    setProducts: (products: Product[]) => void;
}

export const useProductsStore = create<ProdctsStore>((set) => ({
    products: [],
    setProducts: (newProducts) => set(() => ({ products: newProducts })),
}));