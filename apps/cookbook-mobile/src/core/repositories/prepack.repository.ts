import { Prepack, PrepackDto, PrepackEntity } from "@cookbook/domain/types/recipe/prepack";
import { inject, injectable } from "inversify";
import { ResultSet } from "react-native-sqlite-storage";
import uuid from 'react-native-uuid';
import { Database, Query } from "../database/database";
import { ProductIngredientRowToModel, ProductIngredientRow, ProductIngredientRowToEntity } from "./recipes.repository";
import { GroupById } from "./util";

@injectable()
export class PrepacksRepository {
    @inject(Database) private readonly database!: Database;

    private readonly SelectPrepackIngredientRowsSQL =
        `SELECT 
            [Prepacks].[Id],
            [Prepacks].[Name],
            [Prepacks].[LastModified],
            [Prepacks].[FinalWeight],
            [PrepackProductIngredients].[PositionNumber],
            [PrepackProductIngredients].[ServingUnits],
            [PrepackProductIngredients].[ServingMeasuring],
            [Products].[Id] AS [ProductId],
            [Products].[Name] AS [ProductName],
            [ProductPricing].[Measuring],
            [ProductPricing].[Price],
            [ProductPricing].[WeightInGrams],
            [ProductPricing].[NumberOfUnits]
        FROM [Prepacks]
        LEFT JOIN [PrepackProductIngredients] ON [PrepackProductIngredients].[PrepackId] = [Prepacks].[Id]
        LEFT JOIN [Products] ON [Products].[Id] = [PrepackProductIngredients].[ProductId]
        LEFT JOIN [ProductPricing] ON [ProductPricing].[ProductId] = [Products].[Id]`;

    public Create(): Prepack {
        return new Prepack({
            id: uuid.v4().toString(),
            name: '',
            lastModified: new Date().toISOString(),
            ingredients: [],
            finalWeight: 0,
        });
    }

    public async All(): Promise<Prepack[]> {
        const [result] = await this.database.ExecuteSql(
            `${this.SelectPrepackIngredientRowsSQL}
            ORDER BY [Prepacks].[Id], [PrepackProductIngredients].[PositionNumber]`
        );

        return MapPrepackRowsSet(result, RowToModel);
    }

    public async Many(ids: string[]): Promise<Prepack[]> {
        const [result] = await this.database.ExecuteSql(
            `${this.SelectPrepackIngredientRowsSQL}
            WHERE [Prepacks].[Id] IN (${ids.map(() => '?').join(', ')})
            ORDER BY [Prepacks].[Id], [PrepackProductIngredients].[PositionNumber];`,
            ids
        );

        return MapPrepackRowsSet(result, RowToModel);
    }

    public async One(id: string): Promise<Prepack | null> {
        const [result] = await this.database.ExecuteSql(
            `${this.SelectPrepackIngredientRowsSQL}
            ORDER BY [PrepackProductIngredients].[PositionNumber]
            WHERE [Prepacks].[Id] = ?`,
            [id]
        );

        return result.rows.length
            ? RowToModel(result.rows.raw())
            : null;
    }

    public async Save(prepack: PrepackDto): Promise<void> {
        await this.database.Transaction([
            [
                `INSERT OR REPLACE INTO [Prepacks] ([Id], [Name], [FinalWeight], [LastModified]) VALUES (?, ?, ?, ?);`,
                [prepack.id, prepack.name, prepack.finalWeight, prepack.lastModified]
            ],
            ...prepack.ingredients.map(
                (ingredient, idx) =>
                    [
                        `INSERT OR REPLACE INTO [PrepackProductIngredients] ([PrepackId], [PositionNumber], [ProductId], [ServingUnits], [ServingMeasuring])
                        VALUES (?, ?, ?, ?, ?);`,
                        [
                            prepack.id,
                            idx + 1,
                            ingredient.product.id,
                            ingredient.serving.units,
                            ingredient.serving.measuring
                        ]
                    ] as Query
            ),
            [
                `DELETE FROM [PrepackProductIngredients] WHERE [PrepackId] = ? AND [PositionNumber] > ?;`,
                [prepack.id, prepack.ingredients.length]
            ]
        ]);
    }

    // @TODO DRY
    public async SaveEntity(entity: PrepackEntity): Promise<void> {
        await this.database.Transaction([
            [
                `INSERT OR REPLACE INTO [Prepacks] ([Id], [Name], [FinalWeight], [LastModified]) VALUES (?, ?, ?, ?);`,
                [entity.id, entity.name, entity.finalWeight, entity.lastModified]
            ],
            ...entity.ingredients.map(
                (ingredient, idx) =>
                    [
                        `INSERT OR REPLACE INTO [PrepackProductIngredients] ([PrepackId], [PositionNumber], [ProductId], [ServingUnits], [ServingMeasuring])
                        VALUES (?, ?, ?, ?, ?);`,
                        [
                            entity.id,
                            idx + 1,
                            ingredient.productId,
                            ingredient.serving.units,
                            ingredient.serving.measuring
                        ]
                    ] as Query
            ),
            [
                `DELETE FROM [PrepackProductIngredients] WHERE [PrepackId] = ? AND [PositionNumber] > ?;`,
                [entity.id, entity.ingredients.length]
            ]
        ]);
    }

    public async EntitiesModifiedAfter(date: Date): Promise<PrepackEntity[]> {
        const [result] = await this.database.ExecuteSql(
            `${this.SelectPrepackIngredientRowsSQL}
            WHERE [LastModified] >= ?;`,
            [date.toISOString()]
        );

        return MapPrepackRowsSet(result, RowToEntity);
    }

    public async Delete(id: string): Promise<void> {
        await this.database.Transaction([
            [
                `DELETE FROM [PrepackProductIngredients] WHERE [PrepackId] = ?;`,
                [id]
            ],
            [
                `DELETE FROM [Prepacks] WHERE [Id] = ?;`,
                [id]
            ]
        ]);
    }
}

export interface PrepackRow extends ProductIngredientRow {
    Id: string;
    Name: string;
    LastModified: string;
    FinalWeight: number;
}

function MapPrepackRowsSet<E>(set: ResultSet, mapper: (rows: PrepackRow[]) => E): E[] {
    return set.rows.length
        ? Array.from(GroupById<PrepackRow>(set.rows.raw()).values()).map(mapper)
        : [];
}

function RowToModel(rows: PrepackRow[]): Prepack {
    const isEmptyPrepack = rows.length === 1 && rows[0].PositionNumber === null;

    return new Prepack({
        id: rows[0].Id,
        name: rows[0].Name,
        lastModified: rows[0].LastModified,
        finalWeight: rows[0].FinalWeight,
        ingredients: isEmptyPrepack ? [] : rows.map(ProductIngredientRowToModel)
    });
}

function RowToEntity(rows: PrepackRow[]): PrepackEntity {
    const isEmptyPrepack = rows.length === 1 && rows[0].PositionNumber === null;

    return {
        id: rows[0].Id,
        name: rows[0].Name,
        lastModified: rows[0].LastModified,
        finalWeight: rows[0].FinalWeight,
        ingredients: isEmptyPrepack ? [] : rows.map(ProductIngredientRowToEntity)
    };
}
