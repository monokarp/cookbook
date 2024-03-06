import { Product, ProductDto } from "../product/product";
import { Prepack, PrepackDto } from "../prepack/prepack";
import { PrepackIngredient, PrepackIngredientDto, PrepackIngredientEntity } from "./prepack-ingredient";
import { ProductIngredient, ProductIngredientDto, ProductIngredientEntity } from "./product-ingredient";

export type Position = ProductIngredient | PrepackIngredient;

export type PositionDto = ProductIngredientDto | PrepackIngredientDto;

export function isPrepackIngredient(position: PositionDto): position is PrepackIngredientDto {
    const prepackPosition = position as PrepackIngredientDto;

    return isPrepack(prepackPosition.prepack);
}

export function isProductIngredient(position: PositionDto): position is ProductIngredientDto {
    return isProduct((position as ProductIngredientDto).product);
}

export type IngredientBase = ProductDto | PrepackDto;

export function isProduct(ingredient: IngredientBase): ingredient is Product {
    return (ingredient as Product)?.pricing !== undefined;
}

export function isPrepack(ingredient: IngredientBase): ingredient is Prepack {
    return (ingredient as Prepack)?.finalWeight !== undefined;
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

export function mapPositions(data: PositionDto[]): Position[] {
    return data.map(dto => {
        if (isPrepackIngredient(dto)) {
            return new PrepackIngredient(dto);
        }

        if (isProductIngredient(dto)) {
            return new ProductIngredient(dto);
        }

        throw new Error('Unknown position type');
    });
}

export function containsNestedIngredient(host: Position, target: Prepack): boolean {
    if (isProductIngredient(host)) {
        return false;
    } else if (host.id === target.id) {
        return true;
    } else {
        return host.prepack.ingredients.reduce((result, next) => result || containsNestedIngredient(next, target), false);
    }
}