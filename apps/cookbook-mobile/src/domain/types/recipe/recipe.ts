import { roundMoney } from "../../util";
import { Prepack, PrepackDto } from "./prepack";
import { Ingredient, IngredientDto } from "./ingredient";
import { NamedEntity } from "../named-entity";


export class Recipe implements NamedEntity {
    public readonly id: string;
    public readonly name: string;
    public readonly positions: Position[];

    constructor(data: { id: string, name: string, positions: Position[] }) {
        this.id = data.id;
        this.name = data.name;
        this.positions = data.positions;
    }

    public totalPrice(): number {
        return roundMoney(this.positions.reduce((total, next) => total + next.price(), 0));
    }
}

export function isPrepack(position: PositionDto): position is PrepackDto {
    return (position as PrepackDto).finalWeight !== undefined;
}

export function isIngredient(position: PositionDto): position is IngredientDto {
    return (position as IngredientDto).serving !== undefined;
}

export type Position = Ingredient | Prepack;

export type PositionDto = IngredientDto | PrepackDto;