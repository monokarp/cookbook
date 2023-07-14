import { roundMoney } from "../../util";
import { ProductIngredient, ProductIngredientDto } from "./product-ingredient";
import { NamedEntity } from "../named-entity";
import { PrepackIngredient, PrepackIngredientDto } from "./prepack-ingredient";
import { Product, ProductDto } from "../product/product";
import { Prepack, PrepackDto } from "./prepack";


export class Recipe implements NamedEntity {
    public readonly id: string;
    public readonly name: string;
    public readonly positions: Position[];

    constructor(data: { id: string, name: string, positions: PositionDto[] }) {
        this.id = data.id;
        this.name = data.name;
        this.positions = data.positions.map(dto => {
            if (isPrepackIngredient(dto)) {
                return new PrepackIngredient(dto);
            }

            if (isProductIngredient(dto)) {
                return new ProductIngredient(dto);
            }

            throw new Error('Unknown position type');
        });
    }

    public totalPrice(): number {
        return roundMoney(this.positions.reduce((total, next) => total + next.price(), 0));
    }
}

export function isPrepackIngredient(position: PositionDto): position is PrepackIngredientDto {
    const prepackPosition = position as PrepackIngredientDto;

    return isPrepack(prepackPosition.prepack);
}

export function isProductIngredient(position: PositionDto): position is ProductIngredientDto {
    return isProduct((position as ProductIngredientDto).product);
}

export type Position = ProductIngredient | PrepackIngredient;

export type PositionDto = ProductIngredientDto | PrepackIngredientDto;

export type IngredientBase = ProductDto | PrepackDto;

export function isProduct(ingredient: IngredientBase): ingredient is Product {
    return (ingredient as Product)?.pricing !== undefined;
}

export function isPrepack(ingredient: IngredientBase): ingredient is Prepack {
    return (ingredient as Prepack)?.finalWeight !== undefined;
}
