import { roundMoney, roundMoneySafe } from "../../util";
import { NamedEntity } from "../named-entity";
import { Position, PositionDto, PositionEntity, mapPositions } from "../position/position";


export class Prepack implements NamedEntity {
    public readonly id: string;
    public readonly name: string;
    public readonly lastModified: string;
    public readonly ingredients: Position[];
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
        this.ingredients = mapPositions(data.ingredients);
    }

    public price(): number {
        return roundMoney(this.ingredients.reduce((total, next) => total + next.price(), 0));
    }

    public pricePerGram(): number {
        return roundMoneySafe(this.finalWeight ? this.price() / this.finalWeight : 0);
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
    ingredients: PositionDto[];
}

export interface PrepackEntity {
    id: string;
    name: string;
    lastModified: string;
    finalWeight: number;
    description: string;
    ingredients: PositionEntity[];
}