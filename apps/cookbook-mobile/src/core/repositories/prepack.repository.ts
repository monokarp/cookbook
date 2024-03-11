import { PositionEntity, isPrepackIngredientEntity, isProductIngredientEntity } from "@cookbook/domain/types/position/position";
import { PrepackEntity } from "@cookbook/domain/types/prepack/prepack";
import { inject, injectable } from "inversify";
import { Database, Query } from "../database/database";
import { MapPrepack, MapPrepackIngredient, MapProductIngredient, PrepackIngredientRow, PrepackRow, ProductIngredientRow } from "./types/prepacks";

@injectable()
export class PrepacksRepository {
    @inject(Database) private readonly database!: Database;

    private readonly SelectPrepackIngredientRowsSQL =
        `SELECT 
            [Prepacks].[Id],
            [Prepacks].[Name],
            [Prepacks].[LastModified],
            [Prepacks].[FinalWeight],
            [Prepacks].[Description]
        FROM [Prepacks]`;

    public async All(): Promise<PrepackEntity[]> {
        const [result] = await this.database.ExecuteSql(
            `${this.SelectPrepackIngredientRowsSQL};`
        );

        if (!result.rows.length) { return []; }

        return this.MapWithNestedEntities(result.rows.raw());
    }

    public async Many(ids: string[]): Promise<PrepackEntity[]> {
        const [result] = await this.database.ExecuteSql(
            `${this.SelectPrepackIngredientRowsSQL}
            WHERE [Prepacks].[Id] IN (${ids.map(() => '?').join(', ')});`,
            ids
        );

        if (!result.rows.length) { return []; }

        return this.MapWithNestedEntities(result.rows.raw());
    }

    public async ModifiedAfter(date: Date): Promise<PrepackEntity[]> {
        const [result] = await this.database.ExecuteSql(
            `${this.SelectPrepackIngredientRowsSQL}
            WHERE [Prepacks].[LastModified] >= ?;`,
            [date.toISOString()]
        );

        if (!result.rows.length) { return []; }

        return this.MapWithNestedEntities(result.rows.raw());
    }

    public async One(id: string): Promise<PrepackEntity | null> {
        const [result] = await this.database.ExecuteSql(
            `${this.SelectPrepackIngredientRowsSQL}
            WHERE [Prepacks].[Id] = ?`,
            [id]
        );

        if (!result.rows.length) { return null; }

        const [prepack] = await this.MapWithNestedEntities(result.rows.raw());

        return prepack;
    }

    public async Save(prepack: PrepackEntity): Promise<void> {
        await this.database.Transaction([
            [
                `INSERT OR REPLACE INTO [Prepacks] ([Id], [Name], [FinalWeight], [LastModified], [Description]) VALUES (?, ?, ?, ?, ?);`,
                [prepack.id, prepack.name, prepack.finalWeight, new Date().toISOString(), prepack.description]
            ],
            [
                `DELETE FROM [PrepackProductIngredients] WHERE [PrepackId] = ?;`,
                [prepack.id]
            ],
            [
                `DELETE FROM [PrepackPrepackIngredients] WHERE [PrepackId] = ?;`,
                [prepack.id]
            ],
            ...prepack.ingredients
                .map(
                    (ingredient: PositionEntity, idx) => {
                        if (isProductIngredientEntity(ingredient)) {
                            return [
                                `INSERT INTO [PrepackProductIngredients] ([PrepackId], [PositionNumber], [ProductId], [ServingUnits], [ServingMeasuring])
                        VALUES (?, ?, ?, ?, ?);`,
                                [
                                    prepack.id,
                                    idx + 1,
                                    ingredient.productId,
                                    ingredient.serving.units,
                                    ingredient.serving.measuring
                                ]
                            ] as Query;
                        }

                        if (isPrepackIngredientEntity(ingredient)) {
                            return [
                                `INSERT INTO [PrepackPrepackIngredients] ([PrepackId], [PrepackIngredientId], [PositionNumber], [WeightInGrams])
                            VALUES (?, ?, ?, ?);`,
                                [
                                    prepack.id,
                                    ingredient.prepackId,
                                    idx + 1,
                                    ingredient.weightInGrams
                                ]
                            ] as Query;
                        }

                        throw new Error('Unknown ingredient type', ingredient);
                    }
                ),
        ]);
    }

    public async Delete(id: string): Promise<void> {
        await this.database.Transaction([
            ['DELETE FROM [PrepackProductIngredients] WHERE [PrepackId] = ?;', [id]],
            ['DELETE FROM [PrepackPrepackIngredients] WHERE [PrepackId] = ?;', [id]],
            ['DELETE FROM [Prepacks] WHERE [Id] = ?;', [id]],
            ['INSERT INTO [PrepacksPendingDeletion] VALUES (?)', [id]],
        ]);
    }

    public async GetPendingDeletion(): Promise<string[]> {
        const [result] = await this.database.ExecuteSql('SELECT [Id] FROM [PrepacksPendingDeletion]');

        return result.rows.raw().map(row => row.Id);
    }

    public async ClearPendingDeletion(): Promise<void> {
        await this.database.ExecuteSql('DELETE FROM [PrepacksPendingDeletion]');
    }

    private async MapWithNestedEntities(prepacks: PrepackRow[]): Promise<PrepackEntity[]> {
        const prepackIds: string[] = prepacks.map(r => r.Id);

        const [productPositions, prepackPositions] = await this.GetNestedEntities(prepackIds);

        const recipesMap = new Map<string, PrepackEntity>();

        for (const one of prepacks) {
            recipesMap.set(one.Id, MapPrepack(one));
        }

        for (const one of productPositions) {
            recipesMap.get(one.PrepackId).ingredients[one.PositionNumber - 1] = MapProductIngredient(one);
        }

        for (const one of prepackPositions) {
            recipesMap.get(one.PrepackId).ingredients[one.PositionNumber - 1] = MapPrepackIngredient(one);
        }

        return [...recipesMap.values()];
    }

    private async GetNestedEntities(prepackIds: string[]) {
        return await Promise.all([
            this.GetProductRows(prepackIds),
            this.GetPrepackRows(prepackIds),
        ]);
    }

    private async GetProductRows(prepackIds: string[]): Promise<ProductIngredientRow[]> {
        const [productPositionsResult] = await this.database.ExecuteSql(
            `SELECT
                [PrepackProductIngredients].[PrepackId],
                [PrepackProductIngredients].[ProductId],
                [PrepackProductIngredients].[PositionNumber],
                [PrepackProductIngredients].[ServingUnits],
                [PrepackProductIngredients].[ServingMeasuring]
            FROM [PrepackProductIngredients]
            WHERE [PrepackProductIngredients].[PrepackId] IN (${prepackIds.map(() => '?').join(', ')});`,
            prepackIds
        );

        return productPositionsResult.rows.raw();
    }

    private async GetPrepackRows(prepackIds: string[]): Promise<PrepackIngredientRow[]> {
        const [prepackPositionsResult] = await this.database.ExecuteSql(
            `SELECT
                [PrepackPrepackIngredients].[PrepackId],
                [PrepackPrepackIngredients].[PrepackIngredientId],
                [PrepackPrepackIngredients].[PositionNumber],
                [PrepackPrepackIngredients].[WeightInGrams]
            FROM [PrepackPrepackIngredients]
            WHERE [PrepackPrepackIngredients].[PrepackId] IN (${prepackIds.map(() => '?').join(', ')});`,
            prepackIds
        );

        return prepackPositionsResult.rows.raw();
    }
}
