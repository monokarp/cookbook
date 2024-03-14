import { NamedEntity } from "../named-entity";
import { ProductNutrition } from "./product-nutrition";
import { ProductMeasuring, ProductPricing, ProductPricingDto } from "./product-pricing";

export class Product implements NamedEntity {
    public readonly id: string;
    public readonly name: string;
    public readonly lastModified: string;
    public readonly nutrition: ProductNutrition;
    public readonly pricing: ProductPricing;

    public static Empty(): Product {
        return new Product({
            id: '',
            name: '',
            lastModified: '',
            nutrition: {
                carbs: 0,
                prot: 0,
                fat: 0,
            },
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
        this.lastModified = dto.lastModified;
        this.nutrition = { ...dto.nutrition };
        this.pricing = new ProductPricing(dto.pricing);
    }
}

export interface ProductDto {
    id: string;
    name: string;
    lastModified: string;
    nutrition: ProductNutrition,
    pricing: ProductPricingDto;
}

export type ProductEntity = ProductDto;
