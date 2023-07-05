import { roundMoney } from "../../util";

export enum ProductMeasuring {
    Units = "units",
    Grams = "grams",
};

export class ProductPricing implements ProductPricingDto {
    public readonly measuring: ProductMeasuring;
    public readonly price: number;
    public readonly weightInGrams: number;
    public readonly numberOfUnits: number;

    constructor(dto: ProductPricingDto) {
        this.measuring = dto.measuring;
        this.price = dto.price;
        this.weightInGrams = dto.weightInGrams;
        this.numberOfUnits = dto.numberOfUnits;
    }

    public pricePerGram(): number {
        return roundMoney(this.price / this.weightInGrams);
    }

    public pricePerUnit(): number {
        return roundMoney(this.price / this.numberOfUnits);
    }
}

export interface ProductPricingDto {
    measuring: ProductMeasuring;
    price: number;
    weightInGrams: number;
    numberOfUnits: number;
}
