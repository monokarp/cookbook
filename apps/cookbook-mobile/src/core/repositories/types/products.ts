import { ProductEntity } from "@cookbook/domain/types/product/product";
import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";

export function MapProductRow(row: ProductWithPricingRow): ProductEntity {
    return {
        id: row.ProductId,
        name: row.ProductName,
        lastModified: row.LastModified,
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
    Measuring: ProductMeasuring;
    Price: number;
    WeightInGrams: number;
    NumberOfUnits: number;
}