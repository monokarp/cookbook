import { Product } from "@cookbook/domain/types/product/product";
import { Prepack } from "@cookbook/domain/types/prepack/prepack";
import { entityListStoreFactory } from "../../entity-list.store";

export const useIngredientItemsStore = entityListStoreFactory<Product | Prepack>();
