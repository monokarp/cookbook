import { Product } from '@cookbook/domain/types/product/product';
import { Prepack } from '@cookbook/domain/types/recipe/prepack';
import { entityListStoreFactory } from '../../entity-list.store';

export const useIngredientItemsStore = entityListStoreFactory<Product | Prepack>();