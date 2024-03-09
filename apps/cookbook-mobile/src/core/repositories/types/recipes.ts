import { PrepackIngredientEntity } from "@cookbook/domain/types/position/prepack-ingredient";
import { ProductIngredientEntity } from "@cookbook/domain/types/position/product-ingredient";
import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";
import { PositionGroup, RecipeEntity } from "@cookbook/domain/types/recipe/recipe";

export interface RecipeRow {
    Id: string;
    Name: string;
    LastModified: string;
    Description: string;
}

export function MapRecipe(row: RecipeRow): RecipeEntity {
    return {
        id: row.Id,
        name: row.Name,
        lastModified: row.LastModified,
        description: row.Description,
        positions: [],
        groups: [],
    };
}

export interface ProductIngredientRow {
    RecipeId: string;
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
    RecipeId: string;
    PrepackId: string;
    PositionNumber: number;
    WeightInGrams: number;
}

export function MapPrepackIngredient(row: PrepackIngredientRow): PrepackIngredientEntity {
    return {
        prepackId: row.PrepackId,
        weightInGrams: row.WeightInGrams,
    };
}


export interface PositionGroupRow {
    RecipeId: string;
    Name: string;
    PositionIndicesCsv: string;
}

export function MapGroup(row: PositionGroupRow): PositionGroup {
    return {
        name: row.Name,
        positionIndices: row.PositionIndicesCsv.split(',').map(Number)
    };
}