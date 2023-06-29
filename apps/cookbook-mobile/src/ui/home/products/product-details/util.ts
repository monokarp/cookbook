import { WeightRoundingPrecision } from "apps/cookbook-mobile/src/constants";

export const RegexPatterns = {
    Integer: /^\d+$/,
    WeightDecimal: new RegExp(`^\\d+\.?\\d{0,${WeightRoundingPrecision}}?$`),
    LatinAndCyrillicText: /^[а-яА-Яa-zA-Z0-9\s]+$/i,
};