import { PricingInfo, PricingInfoDto, PricingInfoFrom, ProductPricingType } from "./product-pricing/product-pricing";

export class Product {
    public readonly id: string;
    public readonly name: string;
    public readonly pricing: PricingInfo;

    constructor(dto: ProductDto) {
        this.id = dto.id;
        this.name = dto.name;
        this.pricing = PricingInfoFrom(dto.pricing);
    }

    public pricePerGram(): number {
        return this.pricing.pricePerGram();
    }

    public getPricingType(): ProductPricingType {
        return this.pricing.pricingType;
    }
}

export interface ProductDto {
    id: string;
    name: string;
    pricing: PricingInfoDto;
}
