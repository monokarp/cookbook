import { roundMoney } from "../../util";
import { NamedEntity } from "../named-entity";
import { ProductIngredient, ProductIngredientDto } from "./product-ingredient";


export class Prepack implements NamedEntity {
    public readonly id: string;
    public readonly name: string;
    public readonly ingredients: ProductIngredient[];
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
        this.ingredients = data.ingredients.map(dto => new ProductIngredient(dto));
    }

    public price(): number {
        return roundMoney(this.ingredients.reduce((total, next) => total + next.price(), 0));
    }

    public pricePerGram(): number {
        return roundMoney(this.finalWeight ? this.price() / this.finalWeight : 0);
    }
}

export interface PrepackDto {
    id: string;
    name: string;
    finalWeight: number;
    ingredients: ProductIngredientDto[];
}

