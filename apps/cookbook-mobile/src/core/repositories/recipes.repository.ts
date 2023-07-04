import { inject, injectable } from 'inversify';
import uuid from 'react-native-uuid';
import { Product } from '../../domain/types/product/product';
import { ProductPricing, ProductPricingType } from '../../domain/types/product/product-pricing';
import { Ingridient } from '../../domain/types/recipe/ingridient';
import { Position, Recipe } from '../../domain/types/recipe/recipe';
import { Database, Query } from '../database/database';

@injectable()
export class RecipesRepository {

    @inject(Database) private readonly database!: Database;

    public Create(): Recipe {
        return new Recipe({
            id: uuid.v4().toString(),
            name: '',
            positions: []
        });
    }

    public async All(): Promise<Recipe[]> {
        const [result] = await this.database.ExecuteSql(`
            SELECT [Recipes].[Id], [Recipes].[Name], [Ingridients].[PositionNumber], [Ingridients].[UnitsPerServing], [Ingridients].[ProductId], [Products].[Name] AS [ProductName], [ProductPricing].[PricingType], [ProductPricing].[TotalPrice], [ProductPricing].[TotalWeight], [ProductPricing].[NumberOfUnits]
            FROM [Recipes]
            LEFT JOIN [Ingridients] ON [Ingridients].[RecipeId] = [Recipes].[Id]
            LEFT JOIN [Products] ON [Products].[Id] = [Ingridients].[ProductId]
            LEFT JOIN [ProductPricing] ON [ProductPricing].[ProductId] = [Products].[Id]
            ORDER BY [Recipes].[Id], [Ingridients].[PositionNumber]
        `);

        return result.rows.length
            ? GroupByRecipeId(result.rows.raw()).map(MapRecipe)
            : [];
    }

    public async One(id: string): Promise<Recipe | null> {
        const [result] = await this.database.ExecuteSql(`
            SELECT [Recipes].[Id], [Recipes].[Name], [Ingridients].[PositionNumber], [Ingridients].[UnitsPerServing], [Ingridients].[ProductId], [Products].[Name] AS [ProductName], [ProductPricing].[PricingType], [ProductPricing].[TotalPrice], [ProductPricing].[TotalWeight], [ProductPricing].[NumberOfUnits]
            FROM [Recipes]
            LEFT JOIN [Ingridients] ON [Ingridients].[RecipeId] = [Recipes].[Id]
            LEFT JOIN [Products] ON [Products].[Id] = [Ingridients].[ProductId]
            LEFT JOIN [ProductPricing] ON [ProductPricing].[ProductId] = [Products].[Id]
            ORDER BY [Ingridients].[PositionNumber]
            WHERE [Id] = ?
        `, [id]);

        return result.rows.length
            ? MapRecipe(result.rows.raw())
            : null;
    }

    public async Save(recipe: Recipe): Promise<void> {
        await this.database.Transaction([
            [
                `INSERT OR REPLACE INTO [Recipes] ([Id], [Name]) VALUES (?, ?);`,
                [recipe.id, recipe.name,]
            ],
            ...recipe.positions.map(
                (position, idx) =>
                    <Query>[
                        `INSERT OR REPLACE INTO [Ingridients] ([RecipeId], [PositionNumber], [ProductId], [UnitsPerServing])
                        VALUES (?, ?, ?, ?);`,
                        [
                            recipe.id,
                            idx + 1,
                            position.product.id,
                            position.unitsPerServing
                        ]
                    ]
            ),
        ]);
    }

    public async Delete(id: string): Promise<void> {
        await this.database.Transaction([
            ['DELETE FROM [Ingridients]  WHERE [RecipeId] = ?;', [id]],
            ['DELETE FROM [Recipes]  WHERE [Id] = ?;', [id]]
        ]);
    }
}

interface RecipeRow {
    Id: string;
    Name: string;
    PositionNumber: number;
    UnitsPerServing: number;
    ProductId: string;
    ProductName: string;
    PricingType: string;
    TotalPrice: number;
    TotalWeight: number;
    NumberOfUnits: number;
}

function MapRecipePosition(row: RecipeRow): Position {
    return new Ingridient({
        product: new Product({
            id: row.ProductId,
            name: row.ProductName,
            pricing: new ProductPricing({
                pricingType: row.PricingType as ProductPricingType,
                totalWeight: row.TotalWeight,
                totalPrice: row.TotalPrice,
                numberOfUnits: row.NumberOfUnits
            })
        }),
        unitsPerServing: row.UnitsPerServing
    });
}

function MapRecipe(rows: RecipeRow[]): Recipe {
    return new Recipe({
        id: rows[0].Id,
        name: rows[0].Name,
        positions: rows.map(MapRecipePosition)
    });
}

function GroupByRecipeId(rows: RecipeRow[]): RecipeRow[][] {
    const groups = new Map<string, RecipeRow[]>();

    rows.forEach(row => {
        const group = groups.get(row.Id) ?? [];

        group.push(row);

        groups.set(row.Id, group);
    });

    return Array.from(groups.values());
}