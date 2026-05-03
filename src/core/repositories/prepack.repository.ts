import { PositionEntity, isPrepackIngredientEntity, isProductIngredientEntity } from "@cookbook/domain/types/position/position";
import { PrepackEntity } from "@cookbook/domain/types/prepack/prepack";
import { Database, Query } from "../database/database";
import {
    MapPrepack,
    MapPrepackIngredient,
    MapProductIngredient,
    PrepackIngredientRow,
    PrepackRow,
    ProductIngredientRow,
} from "./types/prepacks";

export class PrepacksRepository {
    constructor(private readonly database: Database) {}

    private readonly SelectPrepackIngredientRowsSQL = `SELECT
            [Prepacks].[Id],
            [Prepacks].[Name],
            [Prepacks].[LastModified],
            [Prepacks].[FinalWeight],
            [Prepacks].[Description]
        FROM [Prepacks]`;

    public async All(): Promise<PrepackEntity[]> {
        const rows = await this.database.ExecuteSql<PrepackRow>(`${this.SelectPrepackIngredientRowsSQL};`);

        if (!rows.length) {
            return [];
        }

        return this.MapWithNestedEntities(rows);
    }

    public async Many(ids: string[]): Promise<PrepackEntity[]> {
        const rows = await this.database.ExecuteSql<PrepackRow>(
            `${this.SelectPrepackIngredientRowsSQL}
            WHERE [Prepacks].[Id] IN (${ids.map(() => "?").join(", ")});`,
            ids,
        );

        if (!rows.length) {
            return [];
        }

        return this.MapWithNestedEntities(rows);
    }

    public async ModifiedAfter(date: Date): Promise<PrepackEntity[]> {
        const rows = await this.database.ExecuteSql<PrepackRow>(
            `${this.SelectPrepackIngredientRowsSQL}
            WHERE [Prepacks].[LastModified] >= ?;`,
            [date.toISOString()],
        );

        if (!rows.length) {
            return [];
        }

        return this.MapWithNestedEntities(rows);
    }

    public async One(id: string): Promise<PrepackEntity | null> {
        const rows = await this.database.ExecuteSql<PrepackRow>(
            `${this.SelectPrepackIngredientRowsSQL}
            WHERE [Prepacks].[Id] = ?;`,
            [id],
        );

        if (!rows.length) {
            return null;
        }

        const [prepack] = await this.MapWithNestedEntities(rows);

        return prepack;
    }

    public async Save(prepack: PrepackEntity): Promise<void> {
        await this.database.Transaction([
            [
                `INSERT OR REPLACE INTO [Prepacks] ([Id], [Name], [FinalWeight], [LastModified], [Description]) VALUES (?, ?, ?, ?, ?);`,
                [prepack.id, prepack.name, prepack.finalWeight, new Date().toISOString(), prepack.description],
            ],
            [`DELETE FROM [PrepackProductIngredients] WHERE [PrepackId] = ?;`, [prepack.id]],
            [`DELETE FROM [PrepackPrepackIngredients] WHERE [PrepackId] = ?;`, [prepack.id]],
            ...prepack.ingredients.map((ingredient: PositionEntity, idx) => {
                if (isProductIngredientEntity(ingredient)) {
                    return [
                        `INSERT INTO [PrepackProductIngredients] ([PrepackId], [PositionNumber], [ProductId], [ServingUnits], [ServingMeasuring])
                        VALUES (?, ?, ?, ?, ?);`,
                        [prepack.id, idx + 1, ingredient.productId, ingredient.serving.units, ingredient.serving.measuring],
                    ] as Query;
                }

                if (isPrepackIngredientEntity(ingredient)) {
                    return [
                        `INSERT INTO [PrepackPrepackIngredients] ([PrepackId], [PrepackIngredientId], [PositionNumber], [WeightInGrams])
                            VALUES (?, ?, ?, ?);`,
                        [prepack.id, ingredient.prepackId, idx + 1, ingredient.weightInGrams],
                    ] as Query;
                }

                throw new Error(`Unknown ingredient type: ${JSON.stringify(ingredient)}`);
            }),
        ]);
    }

    public async Delete(id: string): Promise<void> {
        await this.database.Transaction([
            ["DELETE FROM [PrepackProductIngredients] WHERE [PrepackId] = ?;", [id]],
            ["DELETE FROM [PrepackPrepackIngredients] WHERE [PrepackId] = ?;", [id]],
            ["DELETE FROM [Prepacks] WHERE [Id] = ?;", [id]],
            ["INSERT INTO [PrepacksPendingDeletion] VALUES (?);", [id]],
        ]);
    }

    public async GetPendingDeletion(): Promise<string[]> {
        const rows = await this.database.ExecuteSql<{ Id: string }>("SELECT [Id] FROM [PrepacksPendingDeletion]");

        return rows.map(row => row.Id);
    }

    public async ClearPendingDeletion(): Promise<void> {
        await this.database.ExecuteSql("DELETE FROM [PrepacksPendingDeletion]");
    }

    private async MapWithNestedEntities(prepacks: PrepackRow[]): Promise<PrepackEntity[]> {
        const prepackIds: string[] = prepacks.map(r => r.Id);

        const [productPositions, prepackPositions] = await this.GetNestedEntities(prepackIds);

        const prepacksMap = new Map<string, PrepackEntity>();

        for (const one of prepacks) {
            prepacksMap.set(one.Id, MapPrepack(one));
        }

        for (const one of productPositions) {
            prepacksMap.get(one.PrepackId)!.ingredients[one.PositionNumber - 1] = MapProductIngredient(one);
        }

        for (const one of prepackPositions) {
            prepacksMap.get(one.PrepackId)!.ingredients[one.PositionNumber - 1] = MapPrepackIngredient(one);
        }

        return [...prepacksMap.values()];
    }

    private async GetNestedEntities(prepackIds: string[]) {
        return await Promise.all([this.GetProductRows(prepackIds), this.GetPrepackRows(prepackIds)]);
    }

    private async GetProductRows(prepackIds: string[]): Promise<ProductIngredientRow[]> {
        return this.database.ExecuteSql<ProductIngredientRow>(
            `SELECT
                [PrepackProductIngredients].[PrepackId],
                [PrepackProductIngredients].[ProductId],
                [PrepackProductIngredients].[PositionNumber],
                [PrepackProductIngredients].[ServingUnits],
                [PrepackProductIngredients].[ServingMeasuring]
            FROM [PrepackProductIngredients]
            WHERE [PrepackProductIngredients].[PrepackId] IN (${prepackIds.map(() => "?").join(", ")});`,
            prepackIds,
        );
    }

    private async GetPrepackRows(prepackIds: string[]): Promise<PrepackIngredientRow[]> {
        return this.database.ExecuteSql<PrepackIngredientRow>(
            `SELECT
                [PrepackPrepackIngredients].[PrepackId],
                [PrepackPrepackIngredients].[PrepackIngredientId],
                [PrepackPrepackIngredients].[PositionNumber],
                [PrepackPrepackIngredients].[WeightInGrams]
            FROM [PrepackPrepackIngredients]
            WHERE [PrepackPrepackIngredients].[PrepackId] IN (${prepackIds.map(() => "?").join(", ")});`,
            prepackIds,
        );
    }
}
