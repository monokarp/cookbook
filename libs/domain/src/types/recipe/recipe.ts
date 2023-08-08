import { roundMoney } from "../../util";
import { ProductIngredient, ProductIngredientDto, ProductIngredientEntity, Serving } from "./product-ingredient";
import { NamedEntity } from "../named-entity";
import { PrepackIngredient, PrepackIngredientDto, PrepackIngredientEntity } from "./prepack-ingredient";
import { Product, ProductDto } from "../product/product";
import { Prepack, PrepackDto } from "./prepack";


export class Recipe implements NamedEntity {
    public readonly id: string;
    public readonly name: string;
    public readonly lastModified: string;
    public readonly positions: Position[];

    constructor(data: { id: string, name: string, lastModified: string, positions: PositionDto[] }) {
        this.id = data.id;
        this.name = data.name;
        this.lastModified = data.lastModified;
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

    public totalWeight(): number {
        return this.positions.reduce((total, next) => total + next.weight(), 0);
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

export interface RecipeEntity {
    id: string;
    name: string;
    lastModified: string;
    positions: PositionEntity[];
}

export type PositionEntity = ProductIngredientEntity | PrepackIngredientEntity;

export function isPrepackIngredientEntity(position: PositionEntity): position is PrepackIngredientEntity {
    const prepackPosition = position as PrepackIngredientEntity;

    return !!prepackPosition.prepackId;
}

export function isProductIngredientEntity(position: PositionEntity): position is ProductIngredientEntity {
    const prepackPosition = position as ProductIngredientEntity;

    return !!prepackPosition.productId;
}