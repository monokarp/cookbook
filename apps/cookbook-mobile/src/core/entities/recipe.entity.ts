export class RecipeEntity extends Realm.Object<RecipeEntity> implements RecipeData {
    public static schema: Realm.ObjectSchema = {
        name: "Recipe",
        primaryKey: "id",
        properties: {
            id: { type: "string", indexed: true },
            name: "string",
            positions: {
                type: "list",
                objectType: "IngridientEntity",
            },
        },
    };

    id: string;
    name: string;
    positions: IngridientData[];
}

export class IngridientEntity extends Realm.Object<IngridientEntity> implements IngridientData {
    public static schema: Realm.ObjectSchema = {
        name: "IngridientEntity",
        properties: {
            productId: "uuid",
            unitsPerServing: "int",
        },
    };

    productId: string;
    unitsPerServing: number;
};

export interface RecipeData {
    id: string;
    name: string;
    positions: IngridientData[];
};

export interface IngridientData {
    productId: string,
    unitsPerServing: number,
}