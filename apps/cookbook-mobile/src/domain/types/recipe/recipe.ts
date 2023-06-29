import { round } from "../../util";
import { Ingridient } from "./ingridient";


export class Recipe {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly positions: Position[],
    ) { }

    public totalPrice(): number {
        return this.positions.reduce((total, next) => round(total + next.price()), 0);
    }
}

export type Position = Ingridient;