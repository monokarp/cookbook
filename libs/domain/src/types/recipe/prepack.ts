import { roundMoney } from "../../util";
import { NamedEntity } from "../named-entity";
import { ProductIngredient, ProductIngredientDto, ProductIngredientEntity } from "./product-ingredient";


export class Prepack implements NamedEntity {
    public readonly id: string;
    public readonly name: string;
    public readonly lastModified: string;
    public readonly ingredients: ProductIngredient[];
    public readonly finalWeight: number;
    public readonly description: string;

    public static Empty(): Prepack {
        return new Prepack({
            id: '',
            name: '',
            lastModified: '',
            finalWeight: 0,
            description: '',
            ingredients: []
        });
    }

    constructor(data: PrepackDto) {
        this.id = data.id;
        this.name = data.name;
        this.lastModified = data.lastModified;
        this.finalWeight = data.finalWeight;
        this.description = data.description;
        this.ingredients = data.ingredients.map(dto => new ProductIngredient(dto));
    }

    public price(): number {
        return roundMoney(this.ingredients.reduce((total, next) => total + next.price(), 0));
    }

    public pricePerGram(): number {
        return roundMoney(this.finalWeight ? this.price() / this.finalWeight : 0);
    }

    public weightRatio(): number {
        return this.finalWeight / this.ingredients.reduce((acc, next) => acc + next.weight(), 0);
    }
}

export interface PrepackDto {
    id: string;
    name: string;
    lastModified: string;
    finalWeight: number;
    description: string;
    ingredients: ProductIngredientDto[];
}

export interface PrepackEntity {
    id: string;
    name: string;
    lastModified: string;
    finalWeight: number;
    description: string;
    ingredients: ProductIngredientEntity[];
}