import { roundMoney, roundMoneySafe } from "../../util";
import { Macros } from "../macros";
import { NamedEntity } from "../named-entity";
import { Position, PositionDto, PositionEntity, isPrepackIngredient, isProductIngredient, mapPositions } from "../position/position";
import { Product } from "../product/product";


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

    public clone(): Prepack {
        return new Prepack({
            id: this.id,
            name: this.name,
            lastModified: this.lastModified,
            finalWeight: this.finalWeight,
            description: this.description,
            ingredients: this.ingredients.map(one => {
                if (isPrepackIngredient(one)) {
                    return {
                        prepack: one.prepack.clone(),
                        weightInGrams: one.weightInGrams,
                    };
                }

                if (isProductIngredient(one)) {
                    return {
                        product: new Product(one.product),
                        serving: { ...one.serving },
                    }
                }

                throw new Error(`Cloning prepack: unknown prepack ingredient type:\n${JSON.stringify(one)}`)
            }),
        });
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

    public macros(): Macros {
        return this.ingredients.reduce((acc, next) => {
            const { carbs, prot, fat } = next.macros();

            acc.carbs += carbs;
            acc.prot += prot;
            acc.fat += fat;

            return acc;
        }, {
            carbs: 0,
            prot: 0,
            fat: 0,
        } as Macros);
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
