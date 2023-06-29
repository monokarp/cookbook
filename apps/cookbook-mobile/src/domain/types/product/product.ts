import { PricingInfo } from "./product-pricing";
import { isPricedByWeight, isPricedPerPiece } from "./product-pricing.type-guards";

export class Product {

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly pricing: PricingInfo,
    ) { }

    public pricePerGram(): number {
        return this.pricing.pricePerGram();
    }

    public getPricingType(): ProductPricingType {
        switch (true) {
            case isPricedByWeight(this.pricing): return ProductPricingType.ByWeight;
            case isPricedPerPiece(this.pricing): return ProductPricingType.PerPiece;
            default: throw new Error('Unrecognized product pricing type');
        }
    }
}

export enum ProductPricingType {
    PerPiece = "per-piece",
    ByWeight = "by-weight",
};


