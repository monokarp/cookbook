export const MoneyRoundingPrecision = 2;

export const WeightRoundingPrecision = 3;

export const RegexPatterns = {
    Integer: /^\d+$/,
    Weight: new RegExp(`^\\d+\\.\\d{${WeightRoundingPrecision}}$`),
    Money: new RegExp(`^\\d+\\.?\\d{0,${MoneyRoundingPrecision}}?$`),
    LatinAndCyrillicText: /^[а-яА-Яa-zA-Z0-9\s]+$/i,
};