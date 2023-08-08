import { Prepack, PrepackDto } from "./prepack";

export class PrepackIngredient implements PrepackIngredientDto {
    public readonly prepack: Prepack;
    public readonly weightInGrams: number;

    public static Empty(): PrepackIngredient {
        return new PrepackIngredient({
            prepack: Prepack.Empty(),
            weightInGrams: 0
        });
    }

    constructor(data: PrepackIngredientDto) {
        this.prepack = new Prepack(data.prepack);
        this.weightInGrams = data.weightInGrams;
    }

    public price(): number {
        return this.prepack.pricePerGram() * this.weightInGrams;
    }

    public weight(): number {
        return this.weightInGrams;
    }

    public units(): number {
        return this.weightInGrams;
    }
}

export interface PrepackIngredientDto {
    prepack: PrepackDto;
    weightInGrams: number;
}

export interface PrepackIngredientEntity {
    prepackId: string;
    weightInGrams: number;
}
