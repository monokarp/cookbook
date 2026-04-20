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
        return this.weightInGrams ? roundMoney(this.price / (this.weightInGrams * this.numberOfUnits)) : 0;
    }

    public pricePerUnit(): number {
        return this.numberOfUnits ? roundMoney(this.price / this.numberOfUnits) : 0;
    }
}

export interface ProductPricingDto {
    measuring: ProductMeasuring;
    price: number;
    weightInGrams: number;
    numberOfUnits: number;
}
