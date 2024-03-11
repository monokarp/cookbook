import { isPrepackIngredientEntity, isProductIngredientEntity } from '@cookbook/domain/types/position/position';
import { RecipeEntity } from '@cookbook/domain/types/recipe/recipe';
import { inject, injectable } from 'inversify';
import { Database, Query } from '../database/database';
import { MapGroup, MapPrepackIngredient, MapProductIngredient, MapRecipe, PositionGroupRow, PrepackIngredientRow, ProductIngredientRow, RecipeRow } from './types/recipes';

@injectable()
export class RecipesRepository {

    @inject(Database) private readonly database!: Database;

    private readonly SelectRecipeRowsSQL =
        `SELECT 
            [Recipes].[Id],
            [Recipes].[Name],
            [Recipes].[LastModified],
            [Recipes].[Description]
        FROM [Recipes]`;

    public async All(): Promise<RecipeEntity[]> {
        const [allRecipesResult] = await this.database.ExecuteSql(
            `${this.SelectRecipeRowsSQL};`
        );

        if (!allRecipesResult.rows.length) { return []; }

        return this.MapWithNestedEntities(allRecipesResult.rows.raw());
    }

    public async One(id: string): Promise<RecipeEntity | null> {
        const [recipeResult] = await this.database.ExecuteSql(
            `${this.SelectRecipeRowsSQL}
            WHERE [Recipes].[Id] = ?;`,
            [id]
        );

        if (!recipeResult.rows.length) { return null; }

        const [recipe] = await this.MapWithNestedEntities(recipeResult.rows.raw());

        return recipe;
    }

    public async ModifiedAfter(date: Date): Promise<RecipeEntity[]> {
        const [recipesResult] = await this.database.ExecuteSql(
            `${this.SelectRecipeRowsSQL}
            WHERE [Recipes].[LastModified] >= ?;`,
            [date.toISOString()]
        );

        if (!recipesResult.rows.length) { return []; }

        return this.MapWithNestedEntities(recipesResult.rows.raw());
    }

    public async Save(recipe: RecipeEntity): Promise<void> {
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
            ...recipe.positions.map((position, idx) => {
                if (isProductIngredientEntity(position)) {
                    return [
                        `INSERT INTO [RecipeProductIngredients] ([RecipeId], [PositionNumber], [ProductId], [ServingUnits], [ServingMeasuring])
                        VALUES (?, ?, ?, ?, ?);`,
                        [
                            recipe.id,
                            idx + 1,
                            position.productId,
                            position.serving.units,
                            position.serving.measuring
                        ]
                    ] as Query;
                }

                if (isPrepackIngredientEntity(position)) {
                    return [
                        `INSERT INTO [RecipePrepackIngredients] ([RecipeId], [PositionNumber], [WeightInGrams], [PrepackId])
                        VALUES (?, ?, ?, ?);`,
                        [
                            recipe.id,
                            idx + 1,
                            position.weightInGrams,
                            position.prepackId
                        ]
                    ] as Query;
                }

                throw new Error(`Unknown position type: ${position}`);
            }),
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

    private async MapWithNestedEntities(recipes: RecipeRow[]): Promise<RecipeEntity[]> {
        const recipeIds: string[] = recipes.map(r => r.Id);

        const [productPositions, prepackPositions, groups] = await this.GetNestedEntities(recipeIds);

        const recipesMap = new Map<string, RecipeEntity>();

        for (const one of recipes) {
            recipesMap.set(one.Id, MapRecipe(one));
        }

        for (const one of productPositions) {
            recipesMap.get(one.RecipeId).positions[one.PositionNumber - 1] = MapProductIngredient(one);
        }

        for (const one of prepackPositions) {
            recipesMap.get(one.RecipeId).positions[one.PositionNumber - 1] = MapPrepackIngredient(one);
        }

        for (const one of groups) {
            recipesMap.get(one.RecipeId).groups.push(MapGroup(one));
        }

        return [...recipesMap.values()];
    }

    private async GetNestedEntities(recipeIds: string[]) {
        return await Promise.all([
            this.GetProductRows(recipeIds),
            this.GetPrepackRows(recipeIds),
            this.GetPositionGroups(recipeIds)
        ]);
    }

    private async GetProductRows(recipeIds: string[]): Promise<ProductIngredientRow[]> {
        const [productPositionsResult] = await this.database.ExecuteSql(
            `SELECT
                [RecipeProductIngredients].[RecipeId],
                [RecipeProductIngredients].[ProductId],
                [RecipeProductIngredients].[PositionNumber],
                [RecipeProductIngredients].[ServingUnits],
                [RecipeProductIngredients].[ServingMeasuring]
            FROM [RecipeProductIngredients]
            WHERE [RecipeProductIngredients].[RecipeId] IN (${recipeIds.map(() => '?').join(', ')});`,
            recipeIds
        );

        return productPositionsResult.rows.raw();
    }

    private async GetPrepackRows(recipeIds: string[]): Promise<PrepackIngredientRow[]> {
        const [prepackPositionsResult] = await this.database.ExecuteSql(
            `SELECT
                [RecipePrepackIngredients].[RecipeId],
                [RecipePrepackIngredients].[PrepackId],
                [RecipePrepackIngredients].[PositionNumber],
                [RecipePrepackIngredients].[WeightInGrams]
            FROM [RecipePrepackIngredients]
            WHERE [RecipePrepackIngredients].[RecipeId] IN (${recipeIds.map(() => '?').join(', ')});`,
            recipeIds
        );

        return prepackPositionsResult.rows.raw();
    }

    private async GetPositionGroups(recipeIds: string[]): Promise<PositionGroupRow[]> {
        const [positionGroupRows] = await this.database.ExecuteSql(
            `SELECT
                [RecipePositionGroups].[RecipeId],
                [RecipePositionGroups].[Name],
                [RecipePositionGroups].[PositionIndicesCsv]
            FROM [RecipePositionGroups]
            WHERE [RecipePositionGroups].[RecipeId] IN (${recipeIds.map(() => '?').join(', ')})`,
            recipeIds
        );

        return positionGroupRows.rows.raw();
    }
}
