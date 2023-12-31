import { Product } from '@cookbook/domain/types/product/product';
import { entityListStoreFactory } from '../../common/entity-list.store';

export const useProductsStore = entityListStoreFactory<Product>();
