import { round } from "../../../util";
import { ProductPricing, ProductPricingType } from "./product-pricing";

export class PricedByWeight implements ProductPricing, PricedByWeightDto {
    public readonly totalPrice: number;
    public readonly totalGrams: number;

    public readonly pricingType = ProductPricingType.ByWeight;

    constructor(dto: PricedByWeightDto) {
        this.totalPrice = dto.totalPrice;
        this.totalGrams = dto.totalGrams;
    }

    public pricePerGram(): number {
        return round(this.totalPrice / this.totalGrams);
    }
}

export interface PricedByWeightDto {
    totalPrice: number;
    totalGrams: number;
}