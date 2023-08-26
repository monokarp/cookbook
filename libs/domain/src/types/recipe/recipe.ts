import { roundMoney } from "../../util";
import { ProductIngredient, ProductIngredientDto, ProductIngredientEntity } from "./product-ingredient";
import { NamedEntity } from "../named-entity";
import { PrepackIngredient, PrepackIngredientDto, PrepackIngredientEntity } from "./prepack-ingredient";
import { Product, ProductDto } from "../product/product";
import { Prepack, PrepackDto } from "./prepack";


export class Recipe implements NamedEntity {

    public get id(): string { return this.data.id; }

    public get name(): string { return this.data.name; }
    public set name(value: string) { this.data.name = value; }

    public get lastModified(): string { return this.data.lastModified; }

    public get description(): string { return this.data.description; }
    public set description(value: string) { this.data.description = value; }

    public get positions(): Position[] {
        return this.data.positions.map(dto => {
            if (isPrepackIngredient(dto)) {
                return new PrepackIngredient(dto);
            }

            if (isProductIngredient(dto)) {
                return new ProductIngredient(dto);
            }

            throw new Error('Unknown position type');
        });
    };

    public get groups(): PositionGroup[] {
        return this.data.groups.map(one => ({
            name: one.name,
            positionIndices: [...one.positionIndices]
        }));
    };

    private readonly data: RecipeDto;

    constructor(data: RecipeDto) {
        this.data = JSON.parse(JSON.stringify(data));
    }

    public clone(): Recipe {
        return new Recipe(this.data);
    }

    public totalPrice(): number {
        return roundMoney(this.positions.reduce((total, next) => total + next.price(), 0));
    }

    public totalWeight(): number {
        return this.positions.reduce((total, next) => total + next.weight(), 0);
    }

    public addPosition(value: PositionDto): void {
        this.data.positions.push(value);
    }

    public setPosition(value: PositionDto, index: number): void {
        this.data.positions[index] = value;
    }

    public removePosition(index: number): void {
        const matchingGroup = this.groups.find(one => one.positionIndices.includes(index));

        if (matchingGroup) {
            throw new Error(`Position ${index} is included into ${matchingGroup.name} group and must be removed first`);
        }

        this.data.positions = this.data.positions.filter((_, i) => i !== index);
    }

    public applyGroup(group: PositionGroup) {
        const prunedGroups = this.groups.reduce(
            (groups, next) => {
                if (next.name === group.name) { return groups; }

                const prunedIndices = next.positionIndices.filter(idx => !group.positionIndices.includes(idx));

                if (prunedIndices.length) {
                    groups.push({
                        ...next,
                        positionIndices: prunedIndices
                    });
                }

                return groups;
            }, [] as PositionGroup[]);

        const lastIndexOfUpdatedGroup = group.positionIndices[group.positionIndices.length - 1];
        const supersedingGroupIndex = prunedGroups.findIndex(existingGroup => existingGroup.positionIndices[0] > lastIndexOfUpdatedGroup);

        this.data.groups = supersedingGroupIndex === -1
            ? [...prunedGroups, group]
            : [
                ...prunedGroups.slice(0, supersedingGroupIndex),
                group,
                ...prunedGroups.slice(supersedingGroupIndex)
            ]
    }

    public removeGroup(groupName: string): void {
        this.data.groups = this.data.groups.filter(one => one.name !== groupName);
    }
}

export interface PositionGroup {
    name: string;
    positionIndices: number[];
}

export interface RecipeDto {
    id: string,
    name: string,
    lastModified: string,
    description: string,
    positions: PositionDto[],
    groups: PositionGroup[],
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
    description: string;
    positions: PositionEntity[];
    groups: PositionGroup[];
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