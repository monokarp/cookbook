import { MoneyRoundingPrecision, WeightRoundingPrecision } from "../constants";

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
}

export class FormatString {
    public static Weight(value: string): number {
        return Number(value) * 1000;
    }
}