import { Product } from "@cookbook/domain/types/product/product";
import { Prepack } from "@cookbook/domain/types/recipe/prepack";
import { entityListStoreFactory } from "../../../../common/entity-list.store";

export const useIngredientBaseStore = entityListStoreFactory<Product | Prepack>();