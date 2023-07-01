import { round } from "../../util";
import { Ingridient } from "./ingridient";


export class Recipe {
    public readonly id: string;
    public readonly name: string;
    public readonly positions: Position[];

    constructor(data: { id: string, name: string, positions: Position[] }) {
        this.id = data.id;
        this.name = data.name;
        this.positions = data.positions;
    }

    public totalPrice(): number {
        return this.positions.reduce((total, next) => round(total + next.price()), 0);
    }
}

export type Position = Ingridient;