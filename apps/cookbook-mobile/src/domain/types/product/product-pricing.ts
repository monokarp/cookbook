import { round } from "../../util";

export type PricingInfo = PricedPerPiece | PricedByWeight;

export interface ProductPricing {
    pricePerGram(): number;
}

export class PricedByWeight implements ProductPricing {
    constructor(
        public readonly totalPrice: number,
        public readonly totalGrams: number,
    ) { };

    public pricePerGram(): number {
        return round(this.totalPrice / this.totalGrams);
    }
}

export class PricedPerPiece implements ProductPricing {
    constructor(
        public readonly totalPrice: number,
        public readonly numberOfPieces: number,
        public readonly gramsPerPiece: number,
    ) { };

    public pricePerGram(): number {
        return round(this.totalPrice / (this.numberOfPieces * this.gramsPerPiece));
    }
}