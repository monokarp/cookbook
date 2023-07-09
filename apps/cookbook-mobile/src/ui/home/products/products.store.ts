import { create } from 'zustand';
import { Product } from '../../../domain/types/product/product';

interface ProdctsStore {
    products: Product[];
    filteredProducts: Product[];
    setProducts: (products: Product[]) => void;
    filter: (value: string) => void;
}

export const useProductsStore = create<ProdctsStore>((set) => ({
    products: [],
    filteredProducts: [],
    setProducts: (newProducts) => {
        const sortedProducts = newProducts.sort((a, b) => a.name.localeCompare(b.name));

        set(() => ({ products: sortedProducts, filteredProducts: sortedProducts }));
    },
    filter: (value: string) => set((state) => ({ filteredProducts: state.products.filter((product) => product.name.toLowerCase().includes(value.toLowerCase())) }))
}));