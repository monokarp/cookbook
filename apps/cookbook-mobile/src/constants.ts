export const MoneyRoundingPrecision = 3;

export const WeightRoundingPrecision = 3;

export const InjectionTokens = {
    Realm: 'realm'
};

export const RegexPatterns = {
    Integer: /^\d+$/,
    WeightDecimal: new RegExp(`^\\d+\.?\\d{0,${WeightRoundingPrecision}}?$`),
    LatinAndCyrillicText: /^[а-яА-Яa-zA-Z0-9\s]+$/i,
};