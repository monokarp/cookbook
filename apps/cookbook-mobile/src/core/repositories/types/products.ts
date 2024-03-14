import { ProductEntity } from "@cookbook/domain/types/product/product";
import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";

export function MapProductRow(row: ProductWithPricingRow): ProductEntity {
    return {
        id: row.ProductId,
        name: row.ProductName,
        lastModified: row.LastModified,
        nutrition: {
            carbs: row.Carbs,
            prot: row.Prot,
            fat: row.Fat,
        },
        pricing: {
            measuring: row.Measuring,
            price: row.Price,
            weightInGrams: row.WeightInGrams,
            numberOfUnits: row.NumberOfUnits,
        }
    };
}

export interface ProductWithPricingRow {
    ProductId: string;
    ProductName: string;
    LastModified: string;
    Carbs: number;
    Prot: number;
    Fat: number;
    Measuring: ProductMeasuring;
    Price: number;
    WeightInGrams: number;
    NumberOfUnits: number;
}