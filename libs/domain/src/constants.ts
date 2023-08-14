export const MoneyRoundingPrecision = 2;

export const WeightRoundingPrecision = 3;

export const RegexPatterns = {
    Integer: /^\d+$/,
    Weight: new RegExp(`^\\d+\\.\\d{${WeightRoundingPrecision}}$`),
    Money: new RegExp(`^\\d+\\.?\\d{0,${MoneyRoundingPrecision}}?$`),
    // eslint-disable-next-line no-useless-escape
    EntityName: /^[а-я\w\d\ \\\/\*\%\(\)\-]+$/im,
};