import { inject, injectable } from 'inversify';
import uuid from 'react-native-uuid';
import { Product } from '../../domain/types/product/product';
import { ProductMeasuring, ProductPricing } from '../../domain/types/product/product-pricing';
import { Ingredient } from '../../domain/types/recipe/ingredient';
import { Position, Recipe, isIngredient, isPrepack } from '../../domain/types/recipe/recipe';
import { Database, Query } from '../database/database';
import { GroupById } from './util';
import { ProductRow } from './products.repository';
import { PrepackRepository } from './prepack.repository';
import { Prepack } from '../../domain/types/recipe/prepack';

@injectable()
export class RecipesRepository {

    @inject(Database) private readonly database!: Database;

    @inject(PrepackRepository) private readonly prepackRepository!: PrepackRepository;

    private readonly SelectRecipeIngredientRowsSQL =
        `SELECT 
            [Recipes].[Id],
            [Recipes].[Name],
            [RecipeIngredients].[PositionNumber],
            [RecipeIngredients].[ServingUnits],
            [RecipeIngredients].[ServingMeasuring],
            [RecipeIngredients].[ProductId],
            [Products].[Name] AS [ProductName],
            [ProductPricing].[Measuring],
            [ProductPricing].[Price],
            [ProductPricing].[WeightInGrams],
            [ProductPricing].[NumberOfUnits]
        FROM [Recipes]
        LEFT JOIN [RecipeIngredients] ON [RecipeIngredients].[RecipeId] = [Recipes].[Id]
        LEFT JOIN [Products] ON [Products].[Id] = [RecipeIngredients].[ProductId]
        LEFT JOIN [ProductPricing] ON [ProductPricing].[ProductId] = [Products].[Id]`;

    public Create(): Recipe {
        return new Recipe({
            id: uuid.v4().toString(),
            name: '',
            positions: []
        });
    }

    public async All(): Promise<Recipe[]> {
        const [result] = await this.database.ExecuteSql(
            `${this.SelectRecipeIngredientRowsSQL}
            ORDER BY [Recipes].[Id], [RecipeIngredients].[PositionNumber]`
        );

        return result.rows.length
            ? GroupById<RecipeRow>(result.rows.raw()).map(MapRecipe)
            : [];
    }

    public async One(id: string): Promise<Recipe | null> {
        const [[ingredientPositions], [prepackPositions]] = await Promise.all([
            this.database.ExecuteSql(
                `${this.SelectRecipeIngredientRowsSQL}
                ORDER BY [RecipeIngredients].[PositionNumber]
                WHERE [Id] = ?`,
                [id]
            ),
            this.database.ExecuteSql(
                `SELECT [RecipePrepacks].[PositionNumber], [RecipePrepacks].[PrepackId]
                FROM [RecipePrepacks]
                WHERE [RecipePrepacks][RecipeId] = ?`,
                [id]
            )
        ]);

        if (
            NoPositions(ingredientPositions.rows.raw())
            && NoPositions(prepackPositions.rows.raw())
        ) {
            return null;
        }

        const prepacks = await this.prepackRepository.Many(prepackPositions.rows.raw().map(row => row.PrepackId));

        const result = new Recipe({
            id: ingredientPositions.rows.raw()[0].Id,
            name: ingredientPositions.rows.raw()[0].Name,
            positions: []
        });

        ingredientPositions.rows.raw().forEach(
            (row: RecipeRow) => {
                result.positions[row.PositionNumber - 1] = MapIngredientRow(row);
            }
        );

        prepackPositions.rows.raw().forEach(
            (row: { PositionNumber: number, PrepackId: string }) => {
                const matchingPrepack: Prepack | undefined = prepacks.find(prepack => prepack.id === row.PrepackId);

                if (!matchingPrepack) { throw new Error(`Prepack with id ${row.PrepackId} not found.`); }

                result.positions[row.PositionNumber - 1] = matchingPrepack;
            }
        );

        return result;

    }

    public async Save(recipe: Recipe): Promise<void> {
        await this.database.Transaction([
            [
                `INSERT OR REPLACE INTO [Recipes] ([Id], [Name]) VALUES (?, ?);`,
                [recipe.id, recipe.name,]
            ],
            [
                `DELETE FROM [RecipeIngredients] WHERE [RecipeId] = ?;`,
                [recipe.id]
            ],
            [
                `DELETE FROM [RecipePrepacks] WHERE [RecipeId] = ?;`,
                [recipe.id]
            ],
            ...recipe.positions.map((position, idx) => SavePositionQuery(recipe.id, position, idx)),
        ]);
    }

    public async Delete(id: string): Promise<void> {
        await this.database.Transaction([
            ['DELETE FROM [RecipeIngredients]  WHERE [RecipeId] = ?;', [id]],
            ['DELETE FROM [RecipePrepacks]  WHERE [RecipeId] = ?;', [id]],
            ['DELETE FROM [Recipes]  WHERE [Id] = ?;', [id]]
        ]);
    }
}

interface RecipeRow extends IngredientRow {
    Id: string;
    Name: string;
}

export interface IngredientRow extends ProductRow {
    PositionNumber: number;
    ServingUnits: number;
    ServingMeasuring: ProductMeasuring;
}

export function MapIngredientRow(row: IngredientRow): Ingredient {
    return new Ingredient({
        product: new Product({
            id: row.ProductId,
            name: row.ProductName,
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

function MapRecipePosition(row: RecipeRow): Position {
    return MapIngredientRow(row);
}

function NoPositions(rows: { PositionNumber: number }[]): boolean {
    return rows.length === 1 && rows[0].PositionNumber === null;
}

function MapRecipe(rows: RecipeRow[]): Recipe {
    return new Recipe({
        id: rows[0].Id,
        name: rows[0].Name,
        positions: NoPositions(rows) ? [] : rows.map(MapRecipePosition)
    });
}

function SavePositionQuery(recipeId: string, position: Position, idx: number): Query {
    if (isIngredient(position)) {
        return SaveIngredientQuery(recipeId, position, idx);
    }

    if (isPrepack(position)) {
        return SavePrepackQuery(recipeId, position, idx);
    }

    throw new Error(`Unknown position type: ${position}`);
}

function SaveIngredientQuery(recipeId: string, position: Ingredient, idx: number): Query {
    return [
        `INSERT OR REPLACE INTO [RecipeIngredients] ([RecipeId], [PositionNumber], [ProductId], [ServingUnits], [ServingMeasuring])
        VALUES (?, ?, ?, ?, ?);`,
        [
            recipeId,
            idx + 1,
            position.product.id,
            position.serving.units,
            position.serving.measuring
        ]
    ] as Query
}

function SavePrepackQuery(recipeId: string, position: Prepack, idx: number): Query {
    return [
        `INSERT OR REPLACE INTO [RecipePrepacks] ([RecipeId], [PositionNumber], [PrepackId])
        VALUES (?, ?, ?);`,
        [
            recipeId,
            idx + 1,
            position.id
        ]
    ] as Query
}