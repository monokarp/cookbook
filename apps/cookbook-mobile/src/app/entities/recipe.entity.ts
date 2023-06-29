export interface RecipeEntity {
    id: string,
    name: string,
    positions: IngridientEntity[],
}

export interface IngridientEntity {
    productId: string,
    unitsPerServing: number,
}