import { isPricedByWeight, isPricedPerPiece } from "./product-pricing.type-guards";
import { PricedByWeight, PricedByWeightDto } from "./by-weight";
import { PricedPerPiece, PricedPerPieceDto } from "./per-piece";

export interface ProductPricing {
    pricingType: ProductPricingType;
    pricePerGram(): number;
}

export enum ProductPricingType {
    PerPiece = "per-piece",
    ByWeight = "by-weight",
};

export function PricingInfoFrom(dto: PricingInfoDto): PricingInfo {
    if (isPricedByWeight(dto)) { return new PricedByWeight(dto); }

    if (isPricedPerPiece(dto)) { return new PricedPerPiece(dto); }

    throw new Error('Unrecognized product pricing type');
}

export type PricingInfo = PricedPerPiece | PricedByWeight;

export type PricingInfoDto = PricedByWeightDto | PricedPerPieceDto;


