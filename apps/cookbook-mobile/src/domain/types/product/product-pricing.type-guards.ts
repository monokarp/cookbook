import { PricingInfo, PricedByWeight, PricedPerPiece } from "./product-pricing";


export function isPricedByWeight(productPricing: PricingInfo): productPricing is PricedByWeight {
    const pricing = productPricing as PricedByWeight;

    return Number.isFinite(pricing.totalPrice) && !Number.isNaN(pricing.totalPrice) &&
        Number.isFinite(pricing.totalGrams) && !Number.isNaN(pricing.totalGrams);
}

export function isPricedPerPiece(productPricing: PricingInfo): productPricing is PricedPerPiece {
    const pricing = productPricing as PricedPerPiece;

    return Number.isFinite(pricing.totalPrice) && !Number.isNaN(pricing.totalPrice) &&
        Number.isInteger(pricing.numberOfPieces) &&
        Number.isFinite(pricing.gramsPerPiece) && !Number.isNaN(pricing.gramsPerPiece);
}

