import { PricedByWeightDto } from "./by-weight";
import { PricedPerPieceDto } from "./per-piece";
import { PricingInfoDto } from "./product-pricing";


export function isPricedByWeight(dto: PricingInfoDto): dto is PricedByWeightDto {
    const pricing = dto as PricedByWeightDto;

    return Number.isFinite(pricing.totalPrice) && !Number.isNaN(pricing.totalPrice) &&
        Number.isFinite(pricing.totalGrams) && !Number.isNaN(pricing.totalGrams);
}

export function isPricedPerPiece(dto: PricingInfoDto): dto is PricedPerPieceDto {
    const pricing = dto as PricedPerPieceDto;

    return Number.isFinite(pricing.totalPrice) && !Number.isNaN(pricing.totalPrice) &&
        Number.isInteger(pricing.numberOfPieces) &&
        Number.isFinite(pricing.gramsPerPiece) && !Number.isNaN(pricing.gramsPerPiece);
}

