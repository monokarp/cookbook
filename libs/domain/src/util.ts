import { MoneyFormatPrecision, MoneyRoundingPrecision, WeightFormatPrecision, WeightRoundingPrecision } from "./constants";
import { ProductMeasuring } from "./types/product/product-pricing";
import { Serving } from "./types/position/product-ingredient";

export function roundMoney(value: number): number {
    return Number(value.toFixed(MoneyRoundingPrecision));
}

export function roundMoneySafe(value: number): number {
    return Number(value.toFixed(MoneyRoundingPrecision));
}

export class FormatNumber {
    public static Money(value: number): string {
        return value.toFixed(MoneyFormatPrecision);
    }

    public static Weight(integer: number): string {
        return (integer / 1000).toFixed(WeightRoundingPrecision);
    }

    public static Units(value: number): string {
        return Number(value.toFixed(WeightFormatPrecision)).toString();
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