import { Macros } from "../macros";
import { Prepack, PrepackDto } from "../prepack/prepack";

export class PrepackIngredient implements PrepackIngredientDto {
    public readonly prepack: Prepack;
    public readonly weightInGrams: number;

    public get id(): string { return this.prepack.id; }
    public get name(): string { return this.prepack.name; }

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

    public weightRatio(): number {
        return this.weightInGrams / this.prepack.finalWeight;
    }

    public macros(): Macros {
        const { carbs, prot, fat } = this.prepack.macros();

        const adjustedForWeight = (value: number) => this.weightInGrams * (value / 100);

        return {
            carbs: adjustedForWeight(carbs),
            prot: adjustedForWeight(prot),
            fat: adjustedForWeight(fat),
        };
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
