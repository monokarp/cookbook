import { roundMoney } from "../../util";
import { NamedEntity } from "../named-entity";
import { Ingredient, IngredientDto } from "./ingredient";


export class Prepack implements NamedEntity {
    public readonly id: string;
    public readonly name: string;
    public readonly ingredients: Ingredient[];
    public readonly finalWeight: number;

    public static Empty(): Prepack {
        return new Prepack({
            id: '',
            name: '',
            finalWeight: 0,
            ingredients: []
        });
    }

    constructor(data: PrepackDto) {
        this.id = data.id;
        this.name = data.name;
        this.finalWeight = data.finalWeight;
        this.ingredients = data.ingredients.map(dto => new Ingredient(dto));
    }

    public price(): number {
        return roundMoney(this.ingredients.reduce((total, next) => total + next.price(), 0));
    }
}

export interface PrepackDto {
    id: string;
    name: string;
    ingredients: IngredientDto[];
    finalWeight: number;
}

