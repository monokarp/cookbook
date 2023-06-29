
export interface ProductEntity {
    id: string,
    name: string,
    pricing: PricingEntityInfo,
}

export type PricingEntityInfo = PricedByWeightEntity | PricedPerPieceEntity;

export interface PricedByWeightEntity {
    totalPrice: number;
    totalGrams: number;
}

export interface PricedPerPieceEntity {
    totalPrice: number;
    numberOfPieces: number;
    gramsPerPiece: number;
}

export function isEntityPricedByWeight(entity: PricingEntityInfo): entity is PricedByWeightEntity {
    const pricing = entity as PricedByWeightEntity;

    return Number.isFinite(pricing.totalPrice) && !Number.isNaN(pricing.totalPrice) &&
        Number.isFinite(pricing.totalGrams) && !Number.isNaN(pricing.totalGrams);
}

export function isEntityPricedPerPiece(entity: PricingEntityInfo): entity is PricedPerPieceEntity {
    const pricing = entity as PricedPerPieceEntity;

    return Number.isFinite(pricing.totalPrice) && !Number.isNaN(pricing.totalPrice) &&
        Number.isInteger(pricing.numberOfPieces) &&
        Number.isFinite(pricing.gramsPerPiece) && !Number.isNaN(pricing.gramsPerPiece);
}
