import { round } from "../../../util";
import { ProductPricing, ProductPricingType } from "./product-pricing";

export class PricedPerPiece implements ProductPricing, PricedPerPieceDto {
    public readonly totalPrice: number;
    public readonly numberOfPieces: number;
    public readonly gramsPerPiece: number;

    public readonly pricingType = ProductPricingType.PerPiece;

    constructor(dto: PricedPerPieceDto) {
        this.totalPrice = dto.totalPrice;
        this.numberOfPieces = dto.numberOfPieces;
        this.gramsPerPiece = dto.gramsPerPiece;
    }

    public pricePerGram(): number {
        return round(this.totalPrice / (this.numberOfPieces * this.gramsPerPiece));
    }
}

export interface PricedPerPieceDto {
    totalPrice: number;
    numberOfPieces: number;
    gramsPerPiece: number;
}
