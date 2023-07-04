import { ProductPricing, ProductPricingDto } from "./product-pricing";

export class Product {
    public readonly id: string;
    public readonly name: string;
    public readonly pricing: ProductPricing;

    constructor(dto: ProductDto) {
        this.id = dto.id;
        this.name = dto.name;
        this.pricing = new ProductPricing(dto.pricing);
    }

    public ExportAsString(): string {
        return [
            this.name,
            `Number of pieces - ${this.pricing.numberOfUnits}`,
            `Total price - ${this.pricing.totalPrice}`,
            `Total weight - ${this.pricing.totalWeight}`
        ].join('\n');
    }
}

export interface ProductDto {
    id: string;
    name: string;
    pricing: ProductPricingDto;
}
