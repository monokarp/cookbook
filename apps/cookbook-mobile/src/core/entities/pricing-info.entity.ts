import { Realm } from "@realm/react";
import { PricedByWeightDto } from "../../domain/types/product/product-pricing/by-weight";
import { PricedPerPieceDto } from "../../domain/types/product/product-pricing/per-piece";


export class PricingInfoEntity extends Realm.Object<PricingInfoEntity> implements PricingInfoEntityData {
    public static schema: Realm.ObjectSchema = {
        name: "PricingInfoEntity",
        properties: {
            totalPrice: "float?",
            totalGrams: "float?",
            numberOfPieces: "int?",
            gramsPerPiece: "float?",
        },
    };

    public totalPrice?: number;
    public totalGrams?: number;
    public numberOfPieces?: number;
    public gramsPerPiece?: number;
}

export type PricingInfoEntityData = Partial<PricedByWeightDto & PricedPerPieceDto>;
