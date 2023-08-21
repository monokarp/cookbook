import { Product } from '@cookbook/domain/types/product/product';
import { ProductMeasuring, ProductPricing } from '@cookbook/domain/types/product/product-pricing';
import { Prepack } from '@cookbook/domain/types/recipe/prepack';
import { PrepackIngredient, PrepackIngredientEntity } from '@cookbook/domain/types/recipe/prepack-ingredient';
import { ProductIngredient, ProductIngredientEntity } from '@cookbook/domain/types/recipe/product-ingredient';
import { Position, PositionEntity, PositionGroup, Recipe, RecipeEntity, isPrepackIngredient, isPrepackIngredientEntity, isProductIngredient, isProductIngredientEntity } from '@cookbook/domain/types/recipe/recipe';
import { inject, injectable } from 'inversify';
import uuid from 'react-native-uuid';
import { Database, Query } from '../database/database';
import { PrepacksRepository } from './prepack.repository';
import { ProductRow } from './products.repository';
import { GroupById } from './util';

@injectable()
export class RecipesRepository {

    @inject(Database) private readonly database!: Database;

    @inject(PrepacksRepository) private readonly prepackRepository!: PrepacksRepository;

    private readonly SelectRecipeProductIngredientRowsSQL =
        `SELECT 
            [Recipes].[Id],
            [Recipes].[Name],
            [Recipes].[LastModified],
            [Recipes].[Description],
            [RecipeProductIngredients].[PositionNumber],
            [RecipeProductIngredients].[ServingUnits],
            [RecipeProductIngredients].[ServingMeasuring],
            [RecipeProductIngredients].[ProductId],
            [Products].[Name] AS [ProductName],
            [ProductPricing].[Measuring],
            [ProductPricing].[Price],
            [ProductPricing].[WeightInGrams],
            [ProductPricing].[NumberOfUnits]
        FROM [Recipes]
        LEFT JOIN [RecipeProductIngredients] ON [RecipeProductIngredients].[RecipeId] = [Recipes].[Id]
        LEFT JOIN [Products] ON [Products].[Id] = [RecipeProductIngredients].[ProductId]
        LEFT JOIN [ProductPricing] ON [ProductPricing].[ProductId] = [Products].[Id]`;

    public Create(): Recipe {
        return new Recipe({
            id: uuid.v4().toString(),
            name: '',
            lastModified: '',
            description: '',
            positions: [],
            groups: [],
        });
    }

    public async All(): Promise<Recipe[]> {
        const [ingredientPositions] = await this.database.ExecuteSql(
            `${this.SelectRecipeProductIngredientRowsSQL}
            ORDER BY [Recipes].[Id], [RecipeProductIngredients].[PositionNumber];`
        );

        const recipeMap = GroupById<ProductIngredientRecipeRow>(ingredientPositions.rows.raw());
        const recipeIds = Array.from(recipeMap.keys());

        const [prepackPositions] = await this.database.ExecuteSql(
            `SELECT [RecipePrepackIngredients].[RecipeId] AS [Id], [RecipePrepackIngredients].[PositionNumber], [RecipePrepackIngredients].[WeightInGrams], [RecipePrepackIngredients].[PrepackId]
            FROM [RecipePrepackIngredients]
            WHERE [RecipePrepackIngredients].[RecipeId] IN (${recipeIds.map(() => '?').join(', ')})`,
            recipeIds
        );

        const prepackPositionsMap = GroupById<PrepackIngredientRow>(prepackPositions.rows.raw());
        const prepackIds = [...new Set(prepackPositions.rows.raw().map(row => row.PrepackId)).values()];

        const prepacks = await this.prepackRepository.Many(prepackIds);

        const groupsMap = await this.GetPositionGroupsMap(recipeIds);

        const recipes = [];

        for (const productRows of recipeMap.values()) {
            const recipe = MapRecipe(productRows, groupsMap);

            const prepackPositions = prepackPositionsMap.get(recipe.id) ?? [];

            for (const prepackPosition of prepackPositions) {
                const matchingPrepack: Prepack | undefined = prepacks.find(prepack => prepack.id === prepackPosition.PrepackId);

                if (!matchingPrepack) { throw new Error(`Prepack with id ${prepackPosition.PrepackId} not found.`); }

                recipe.setPosition(
                    new PrepackIngredient({
                        prepack: matchingPrepack,
                        weightInGrams: prepackPosition.WeightInGrams
                    }),
                    prepackPosition.PositionNumber - 1
                );
            }

            recipes.push(recipe);
        }

        return recipes;
    }

    public async One(id: string): Promise<Recipe | null> {
        const [[ingredientPositionRows], [prepackPositions]] = await Promise.all([
            this.database.ExecuteSql(
                `${this.SelectRecipeProductIngredientRowsSQL}
                ORDER BY [RecipeProductIngredients].[PositionNumber]
                WHERE [Id] = ?`,
                [id]
            ),
            this.database.ExecuteSql(
                `SELECT [RecipePrepackIngredients].[PositionNumber], [RecipePrepackIngredients].[WeightInGrams], [RecipePrepackIngredients].[PrepackId]
                FROM [RecipePrepackIngredients]
                WHERE [RecipePrepackIngredients].[RecipeId] = ?`,
                [id]
            )
        ]);

        const ingredientPositions = ingredientPositionRows.rows.raw();

        if (
            NoPositions(ingredientPositions)
            && NoPositions(prepackPositions.rows.raw())
        ) {
            return null;
        }

        const prepacks = await this.prepackRepository.Many(prepackPositions.rows.raw().map(row => row.PrepackId));

        const positionGroups = await this.GetPositionGroupsMap([id]);

        const result = new Recipe({
            id: ingredientPositions[0].Id,
            name: ingredientPositions[0].Name,
            lastModified: ingredientPositions[0].LastModified,
            description: ingredientPositions[0].Description,
            positions: [],
            groups: positionGroups.get(id)?.map(MapPositionGroup) ?? [],
        });

        ingredientPositions.forEach(
            (row: ProductIngredientRecipeRow) => {
                result.setPosition(ProductIngredientRowToModel(row), row.PositionNumber - 1);
            }
        );

        prepackPositions.rows.raw().forEach(
            (row: { PositionNumber: number, WeightInGrams: number, PrepackId: string }) => {
                const matchingPrepack: Prepack | undefined = prepacks.find(prepack => prepack.id === row.PrepackId);

                if (!matchingPrepack) { throw new Error(`Prepack with id ${row.PrepackId} not found.`); }

                result.setPosition(
                    new PrepackIngredient({
                        prepack: matchingPrepack,
                        weightInGrams: row.WeightInGrams
                    }),
                    row.PositionNumber - 1
                );
            }
        );

        return result;
    }

    public async Save(recipe: Recipe): Promise<void> {
        await this.database.Transaction([
            [
                `INSERT OR REPLACE INTO [Recipes] ([Id], [Name], [LastModified], [Description]) VALUES (?, ?, ?, ?);`,
                [recipe.id, recipe.name, new Date().toISOString(), recipe.description]
            ],
            [
                `DELETE FROM [RecipeProductIngredients] WHERE [RecipeId] = ?;`,
                [recipe.id]
            ],
            [
                `DELETE FROM [RecipePrepackIngredients] WHERE [RecipeId] = ?;`,
                [recipe.id]
            ],
            ...recipe.positions.map((position, idx) => SavePositionQuery(recipe.id, position, idx)),
            [
                'DELETE FROM [RecipePositionGroups] WHERE [RecipeId] = ?;',
                [recipe.id]
            ],
            ...recipe.groups.map(one => ([
                'INSERT INTO [RecipePositionGroups] VALUES (?, ?, ?);',
                [recipe.id, one.name, one.positionIndices.join(',')],
            ] as Query)),
        ]);
    }

    public async SaveEntity(entity: RecipeEntity): Promise<void> {
        await this.database.Transaction([
            [
                `INSERT OR REPLACE INTO [Recipes] ([Id], [Name], [LastModified], [Description]) VALUES (?, ?, ?, ?);`,
                [entity.id, entity.name, entity.lastModified, entity.description]
            ],
            [
                `DELETE FROM [RecipeProductIngredients] WHERE [RecipeId] = ?;`,
                [entity.id]
            ],
            [
                `DELETE FROM [RecipePrepackIngredients] WHERE [RecipeId] = ?;`,
                [entity.id]
            ],
            ...entity.positions.map((position, idx) => SavePositionEntityQuery(entity.id, position, idx)),
            [
                'DELETE FROM [RecipePositionGroups] WHERE [RecipeId] = ?;',
                [entity.id]
            ],
            ...entity.groups.map(one => ([
                'INSERT INTO [RecipePositionGroups] VALUES (?, ?, ?);',
                [entity.id, one.name, one.positionIndices.join(',')],
            ] as Query)),
        ]);
    }

    public async EntitiesModifiedAfter(date: Date): Promise<RecipeEntity[]> {
        const [productPositions] = await this.database.ExecuteSql(
            `${this.SelectRecipeProductIngredientRowsSQL}
            WHERE [Recipes].[LastModified] >= ?;`,
            [date.toISOString()]
        );

        const recipeMap = GroupById<ProductIngredientRecipeRow>(productPositions.rows.raw());
        const recipeIds = Array.from(recipeMap.keys());

        const [prepackPositions] = await this.database.ExecuteSql(
            `SELECT [RecipePrepackIngredients].[RecipeId] AS [Id], [RecipePrepackIngredients].[PositionNumber], [RecipePrepackIngredients].[WeightInGrams], [RecipePrepackIngredients].[PrepackId]
            FROM [RecipePrepackIngredients]
            WHERE [RecipePrepackIngredients].[RecipeId] IN (${recipeIds.map(() => '?').join(', ')})`,
            recipeIds
        );

        const prepackPositionsMap = GroupById<PrepackIngredientRow>(prepackPositions.rows.raw());

        const positionGroups = await this.GetPositionGroupsMap(recipeIds);

        const entities: RecipeEntity[] = [];

        for (const productRows of recipeMap.values()) {
            const id = productRows[0].Id;

            const entity = {
                id,
                name: productRows[0].Name,
                lastModified: productRows[0].LastModified,
                description: productRows[0].Description,
                positions: [],
                groups: positionGroups.get(id)?.map(MapPositionGroup) ?? [],
            };

            for (const productPosition of productRows) {
                entity.positions[productPosition.PositionNumber - 1] = {
                    productId: productPosition.ProductId,
                    serving: {
                        units: productPosition.ServingUnits,
                        measuring: productPosition.ServingMeasuring
                    }
                };
            }

            const prepackPositions = prepackPositionsMap.get(entity.id) ?? [];

            for (const prepackPosition of prepackPositions) {
                entity.positions[prepackPosition.PositionNumber - 1] = {
                    prepackId: prepackPosition.PrepackId,
                    weightInGrams: prepackPosition.WeightInGrams
                } as PrepackIngredientEntity;
            }

            entities.push(entity);
        }

        return entities;
    }

    public async UpdateDescription(id: string, description: string) {
        await this.database.ExecuteSql(
            `UPDATE [Recipes]
            SET [Description] = ?,
            [LastModified] = ?
            WHERE [Id] = ?;`,
            [description, new Date().toISOString(), id]
        );
    }

    public async Delete(id: string): Promise<void> {
        await this.database.Transaction([
            ['DELETE FROM [RecipeProductIngredients]  WHERE [RecipeId] = ?;', [id]],
            ['DELETE FROM [RecipePrepackIngredients]  WHERE [RecipeId] = ?;', [id]],
            ['DELETE FROM [RecipePositionGroups] WHERE [RecipeId] = ?;', [id]],
            ['DELETE FROM [Recipes]  WHERE [Id] = ?;', [id]],
            ['INSERT INTO [RecipesPendingDeletion] VALUES (?)', [id]],
        ]);
    }

    public async GetPendingDeletion(): Promise<string[]> {
        const [result] = await this.database.ExecuteSql('SELECT [Id] FROM [RecipesPendingDeletion]');

        return result.rows.raw().map(row => row.Id);
    }

    public async ClearPendingDeletion(): Promise<void> {
        await this.database.ExecuteSql('DELETE FROM [RecipesPendingDeletion]');
    }

    private async GetPositionGroupsMap(recipeIds: string[]) {
        const [positionGroupRows] = await this.database.ExecuteSql(
            `SELECT [RecipePositionGroups].[RecipeId] AS [Id], [RecipePositionGroups].[Name], [RecipePositionGroups].[PositionIndicesCsv]
            FROM [RecipePositionGroups]
            WHERE [RecipePositionGroups].[RecipeId] IN (${recipeIds.map(() => '?').join(', ')})`,
            recipeIds
        );

        return GroupById<PositionGroupRow>(positionGroupRows.rows.raw());
    }
}

interface ProductIngredientRecipeRow extends ProductIngredientRow, RecipeRow { }

interface RecipeRow {
    Id: string;
    Name: string;
    LastModified: string;
    Description: string;
}

export interface ProductIngredientRow extends ProductRow {
    PositionNumber: number;
    ServingUnits: number;
    ServingMeasuring: ProductMeasuring;
}

interface PrepackIngredientRow {
    Id: string;
    PositionNumber: number;
    WeightInGrams: number;
    PrepackId: string;
}

export function ProductIngredientRowToModel(row: ProductIngredientRow): ProductIngredient {
    return new ProductIngredient({
        product: new Product({
            id: row.ProductId,
            name: row.ProductName,
            lastModified: row.LastModified,
            pricing: new ProductPricing({
                measuring: row.Measuring as ProductMeasuring,
                weightInGrams: row.WeightInGrams,
                price: row.Price,
                numberOfUnits: row.NumberOfUnits
            })
        }),
        serving: {
            units: row.ServingUnits,
            measuring: row.ServingMeasuring
        }
    });
}

export function ProductIngredientRowToEntity(row: ProductIngredientRow): ProductIngredientEntity {
    return {
        productId: row.ProductId,
        serving: {
            units: row.ServingUnits,
            measuring: row.ServingMeasuring
        }
    };
}

function MapRecipePosition(row: ProductIngredientRecipeRow): Position {
    return ProductIngredientRowToModel(row);
}

function NoPositions(rows: { PositionNumber: number }[]): boolean {
    return rows.length === 1 && rows[0].PositionNumber === null;
}

function HasPositions(rows: { PositionNumber: number }[]): boolean {
    return !NoPositions(rows);
}

function MapRecipe(rows: ProductIngredientRecipeRow[], allGroups: Map<string, PositionGroupRow[]>): Recipe {
    const recipe = new Recipe({
        id: rows[0].Id,
        name: rows[0].Name,
        lastModified: rows[0].LastModified,
        description: rows[0].Description,
        positions: [],
        groups: allGroups.get(rows[0].Id)?.map(MapPositionGroup) ?? [],
    });

    if (HasPositions(rows)) {
        rows.forEach(row => {
            recipe.setPosition(MapRecipePosition(row), row.PositionNumber - 1);
        });
    }

    return recipe;
}

interface PositionGroupRow {
    Id: string;
    Name: string;
    PositionIndicesCsv: string;
}

function MapPositionGroup(row: PositionGroupRow): PositionGroup {
    return {
        name: row.Name,
        positionIndices: row.PositionIndicesCsv.split(',').map(Number)
    };
}

function SavePositionQuery(recipeId: string, position: Position, idx: number): Query {
    if (isProductIngredient(position)) {
        return [
            `INSERT OR REPLACE INTO [RecipeProductIngredients] ([RecipeId], [PositionNumber], [ProductId], [ServingUnits], [ServingMeasuring])
            VALUES (?, ?, ?, ?, ?);`,
            [
                recipeId,
                idx + 1,
                position.product.id,
                position.serving.units,
                position.serving.measuring
            ]
        ];
    }

    if (isPrepackIngredient(position)) {
        return [
            `INSERT OR REPLACE INTO [RecipePrepackIngredients] ([RecipeId], [PositionNumber], [WeightInGrams], [PrepackId])
            VALUES (?, ?, ?, ?);`,
            [
                recipeId,
                idx + 1,
                position.weightInGrams,
                position.prepack.id
            ]
        ];
    }

    throw new Error(`Unknown position type: ${position}`);
}

function SavePositionEntityQuery(recipeId: string, position: PositionEntity, idx: number): Query {
    if (isProductIngredientEntity(position)) {
        return [
            `INSERT OR REPLACE INTO [RecipeProductIngredients] ([RecipeId], [PositionNumber], [ProductId], [ServingUnits], [ServingMeasuring])
            VALUES (?, ?, ?, ?, ?);`,
            [
                recipeId,
                idx + 1,
                position.productId,
                position.serving.units,
                position.serving.measuring
            ]
        ];
    }

    if (isPrepackIngredientEntity(position)) {
        return [
            `INSERT OR REPLACE INTO [RecipePrepackIngredients] ([RecipeId], [PositionNumber], [WeightInGrams], [PrepackId])
            VALUES (?, ?, ?, ?);`,
            [
                recipeId,
                idx + 1,
                position.weightInGrams,
                position.prepackId
            ]
        ];
    }

    throw new Error(`Unknown position type: ${position}`);
}
