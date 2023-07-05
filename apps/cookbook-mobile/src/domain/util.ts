import { MoneyRoundingPrecision, WeightRoundingPrecision } from "../constants";

export function roundMoney(value: number): number {
    return Number(value.toFixed(MoneyRoundingPrecision));
}

export class FormatNumber {
    public static Money(value: number): string {
        return value.toFixed(MoneyRoundingPrecision);
    }

    public static Weight(value: number): string {
        return value.toFixed(WeightRoundingPrecision);
    }

    public static Units(value: number): string {
        return value.toFixed(2);
    }
}