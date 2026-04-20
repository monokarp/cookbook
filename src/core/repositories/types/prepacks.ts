import { PrepackIngredientEntity } from "@cookbook/domain/types/position/prepack-ingredient";
import { ProductIngredientEntity } from "@cookbook/domain/types/position/product-ingredient";
import { PrepackEntity } from "@cookbook/domain/types/prepack/prepack";
import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";

export interface PrepackRow {
    Id: string;
    Name: string;
    LastModified: string;
    FinalWeight: number;
    Description: string;
}

export function MapPrepack(row: PrepackRow): PrepackEntity {
    return {
        id: row.Id,
        name: row.Name,
        lastModified: row.LastModified,
        description: row.Description,
        finalWeight: row.FinalWeight,
        ingredients: [],
    };
}

export interface ProductIngredientRow {
    PrepackId: string;
    ProductId: string;
    PositionNumber: number;
    ServingUnits: number;
    ServingMeasuring: ProductMeasuring;
}

export function MapProductIngredient(row: ProductIngredientRow): ProductIngredientEntity {
    return {
        productId: row.ProductId,
        serving: {
            measuring: row.ServingMeasuring,
            units: row.ServingUnits,
        }
    };
}

export interface PrepackIngredientRow {
    PrepackId: string;
    PrepackIngredientId: string;
    PositionNumber: number;
    WeightInGrams: number;
}

export function MapPrepackIngredient(row: PrepackIngredientRow): PrepackIngredientEntity {
    return {
        prepackId: row.PrepackIngredientId,
        weightInGrams: row.WeightInGrams,
    };
}
