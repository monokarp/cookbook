import { NamedEntity } from "../named-entity";
import { ProductMeasuring, ProductPricing, ProductPricingDto } from "./product-pricing";

export class Product implements NamedEntity {
    public readonly id: string;
    public readonly name: string;
    public readonly pricing: ProductPricing;

    public static Empty(): Product {
        return new Product({
            id: '',
            name: '',
            pricing: {
                measuring: ProductMeasuring.Grams,
                price: 0,
                weightInGrams: 0,
                numberOfUnits: 0,
            }
        });
    }

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
