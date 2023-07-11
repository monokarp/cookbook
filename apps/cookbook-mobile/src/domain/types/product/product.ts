import { NamedEntity } from "../named-entity";
import { ProductPricing, ProductPricingDto } from "./product-pricing";

export class Product implements NamedEntity {
    public readonly id: string;
    public readonly name: string;
    public readonly pricing: ProductPricing;

    constructor(dto: ProductDto) {
        this.id = dto.id;
        this.name = dto.name;
        this.pricing = new ProductPricing(dto.pricing);
    }
}

export interface ProductDto {
    id: string;
    name: string;
    pricing: ProductPricingDto;
}
