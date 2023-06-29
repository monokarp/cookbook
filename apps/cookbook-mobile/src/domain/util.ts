import { MoneyRoundingPrecision } from "../constants";

export function round(value: number): number {
    return Number(value.toFixed(MoneyRoundingPrecision));
}