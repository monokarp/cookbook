export const MoneyRoundingPrecision = 2;

export const WeightRoundingPrecision = 3;

export const RegexPatterns = {
    Integer: /^\d+$/,
    WeightDecimal: new RegExp(`^\\d+\.?\\d{0,${WeightRoundingPrecision}}?$`),
    LatinAndCyrillicText: /^[а-яА-Яa-zA-Z0-9\s]+$/i,
};