import { ProductEntity } from "../entities/product.entity";
import { PricingInfoEntity } from "../entities/pricing-info.entity";
import { IngridientEntity, RecipeEntity } from "../entities/recipe.entity";

export const realmConfig: Realm.Configuration = {
    schema: [
        ProductEntity,
        PricingInfoEntity,
        RecipeEntity,
        IngridientEntity,
    ],
};