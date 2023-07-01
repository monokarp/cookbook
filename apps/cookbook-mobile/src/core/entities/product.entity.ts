import { Realm } from "@realm/react";
import { PricingInfoDto } from "../../domain/types/product/product-pricing/product-pricing";
import { ProductDto } from "../../domain/types/product/product";

export class ProductEntity extends Realm.Object<ProductEntity> implements ProductDto {
    public static schema: Realm.ObjectSchema = {
        name: "Product",
        primaryKey: "id",
        properties: {
            id: { type: "string", indexed: true },
            name: "string",
            pricing: "PricingInfoEntity",
        },
    };

    public id: string;
    public name: string;
    public pricing: PricingInfoDto;
}
