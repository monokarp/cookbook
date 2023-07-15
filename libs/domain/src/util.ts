import { MoneyRoundingPrecision, WeightRoundingPrecision } from "./constants";
import { ProductMeasuring } from "./types/product/product-pricing";
import { Serving } from "./types/recipe/product-ingredient";

export function roundMoney(value: number): number {
    return Number(value.toFixed(MoneyRoundingPrecision));
}

export class FormatNumber {
    public static Money(value: number): string {
        return value.toFixed(MoneyRoundingPrecision);
    }

    public static Weight(integer: number): string {
        return (integer / 1000).toFixed(WeightRoundingPrecision);
    }

    public static Units(value: number): string {
        return Number(value.toFixed(2)).toString();
    }

    public static ServingUnits(value: Serving): string {
        switch (value.measuring) {
            case ProductMeasuring.Grams: return FormatNumber.Weight(value.units);
            case ProductMeasuring.Units: return FormatNumber.Units(value.units);
            default: throw new Error(`Unexpected measuring: ${value.measuring}`);
        }
    }
}

export class FormatString {
    public static Weight(value: string): number {
        return Number(value) * 1000;
    }
}