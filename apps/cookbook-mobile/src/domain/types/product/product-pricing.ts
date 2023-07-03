import { round } from "../../util";

export enum ProductPricingType {
    PerPiece = "per-piece",
    ByWeight = "by-weight",
};

export class ProductPricing implements ProductPricingDto {
    public readonly pricingType: ProductPricingType;
    public readonly totalPrice: number;
    public readonly totalWeight: number;
    public readonly numberOfUnits: number;

    constructor(dto: ProductPricingDto) {
        this.pricingType = dto.pricingType;
        this.totalPrice = dto.totalPrice;
        this.totalWeight = dto.totalWeight;
        this.numberOfUnits = dto.numberOfUnits;
    }

    public pricePerGram(): number {
        return round(this.totalPrice / this.totalWeight);
    }
}

export interface ProductPricingDto {
    pricingType: ProductPricingType;
    totalPrice: number;
    totalWeight: number;
    numberOfUnits: number;
}
