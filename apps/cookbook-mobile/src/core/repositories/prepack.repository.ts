import { Prepack, PrepackDto, PrepackEntity } from "@cookbook/domain/types/prepack/prepack";
import { inject, injectable } from "inversify";
import { ResultSet } from "react-native-sqlite-storage";
import uuid from 'react-native-uuid';
import { Database, Query } from "../database/database";
import { ProductIngredientRow, ProductIngredientRowToEntity, ProductIngredientRowToModel } from "./recipes.repository";
import { GroupById } from "./util";
import { isProductIngredient, isProductIngredientEntity } from "@cookbook/domain/types/position/position";
import { ProductIngredientDto, ProductIngredientEntity } from "@cookbook/domain/types/position/product-ingredient";

@injectable()
export class PrepacksRepository {
    @inject(Database) private readonly database!: Database;

    private readonly SelectPrepackIngredientRowsSQL =
        `SELECT 
            [Prepacks].[Id],
            [Prepacks].[Name],
            [Prepacks].[LastModified],
            [Prepacks].[FinalWeight],
            [Prepacks].[Description],
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
            lastModified: '',
            finalWeight: 0,
            description: '',
            ingredients: [],
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
        console.log(JSON.stringify(prepack));
        return;

        await this.database.Transaction([
            [
                `INSERT OR REPLACE INTO [Prepacks] ([Id], [Name], [FinalWeight], [LastModified], [Description]) VALUES (?, ?, ?, ?, ?);`,
                [prepack.id, prepack.name, prepack.finalWeight, new Date().toISOString(), prepack.description]
            ],
            ...prepack.ingredients
                .filter(e => isProductIngredient(e))
                .map(
                    (ingredient: ProductIngredientDto, idx) =>
                        // If it's a prepack ingredient I need to flatten its tree into rows?
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
            ],
            // same from prepacks but more complicated
        ]);
    }

    // @TODO DRY
    public async SaveEntity(entity: PrepackEntity): Promise<void> {
        await this.database.Transaction([
            [
                `INSERT OR REPLACE INTO [Prepacks] ([Id], [Name], [FinalWeight], [LastModified], [Description]) VALUES (?, ?, ?, ?, ?);`,
                [entity.id, entity.name, entity.finalWeight, entity.lastModified, entity.description]
            ],
            ...entity.ingredients
                .filter(e => isProductIngredientEntity(e))
                .map(
                    (ingredient: ProductIngredientEntity, idx) =>
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
            WHERE [Prepacks].[LastModified] >= ?;`,
            [date.toISOString()]
        );

        return MapPrepackRowsSet(result, RowToEntity);
    }

    public async Delete(id: string): Promise<void> {
        await this.database.Transaction([
            ['DELETE FROM [PrepackProductIngredients] WHERE [PrepackId] = ?;', [id]],
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
}

export interface PrepackRow extends ProductIngredientRow {
    Id: string;
    Name: string;
    LastModified: string;
    FinalWeight: number;
    Description: string;
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
        description: rows[0].Description,
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
        description: rows[0].Description,
        ingredients: isEmptyPrepack ? [] : rows.map(ProductIngredientRowToEntity)
    };
}
