export const MoneyRoundingPrecision = 4;
export const MoneyFormatPrecision = 2;
export const MoneyRoundingSafe = 4;
export const WeightFormatPrecision = 2;

export const WeightRoundingPrecision = 3;

export const RegexPatterns = {
    Integer: /^\d+$/,
    NonZeroInteger: /^[1-9]\d*$/gm,
    Weight: new RegExp(`^\\d+\\.\\d{${WeightRoundingPrecision}}$`),
    Money: new RegExp(`^\\d+\\.?\\d{0,${MoneyFormatPrecision}}?$`),
    // eslint-disable-next-line no-useless-escape
    EntityName: /^[а-я\w\d\ \\\/\*\%\(\)\-]+$/im,
};