import { Prepack } from "@cookbook/domain/types/recipe/prepack";
import { inject, injectable } from "inversify";
import { ResultSet } from "react-native-sqlite-storage";
import uuid from 'react-native-uuid';
import { Database, Query } from "../database/database";
import { MapProductIngredientRow, ProductIngredientRow } from "./recipes.repository";
import { GroupById } from "./util";

@injectable()
export class PrepackRepository {
    @inject(Database) private readonly database!: Database;

    private readonly SelectPrepackIngredientRowsSQL =
        `SELECT 
            [Prepacks].[Id],
            [Prepacks].[Name],
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
            ingredients: [],
            finalWeight: 0,
        });
    }

    public async All(): Promise<Prepack[]> {
        const [result] = await this.database.ExecuteSql(
            `${this.SelectPrepackIngredientRowsSQL}
            ORDER BY [Prepacks].[Id], [PrepackProductIngredients].[PositionNumber]`
        );

        return MapPrepackRowsSet(result);
    }

    public async Many(ids: string[]): Promise<Prepack[]> {
        const [result] = await this.database.ExecuteSql(
            `${this.SelectPrepackIngredientRowsSQL}
            WHERE [Prepacks].[Id] IN (${ids.map(() => '?').join(', ')})
            ORDER BY [Prepacks].[Id], [PrepackProductIngredients].[PositionNumber];`,
            ids
        );

        return MapPrepackRowsSet(result);
    }

    public async One(id: string): Promise<Prepack | null> {
        const [result] = await this.database.ExecuteSql(
            `${this.SelectPrepackIngredientRowsSQL}
            ORDER BY [PrepackProductIngredients].[PositionNumber]
            WHERE [Prepacks].[Id] = ?`,
            [id]
        );

        return result.rows.length
            ? MapPrepack(result.rows.raw())
            : null;
    }

    public async Save(prepack: Prepack): Promise<void> {
        await this.database.Transaction([
            [
                `INSERT OR REPLACE INTO [Prepacks] ([Id], [Name], [FinalWeight]) VALUES (?, ?, ?);`,
                [prepack.id, prepack.name, prepack.finalWeight]
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
    FinalWeight: number;
}

function MapPrepackRowsSet(set: ResultSet): Prepack[] {
    return set.rows.length
        ? Array.from(GroupById<PrepackRow>(set.rows.raw()).values()).map(MapPrepack)
        : [];
}

function MapPrepack(rows: PrepackRow[]): Prepack {
    const isEmptyPrepack = rows.length === 1 && rows[0].PositionNumber === null;

    return new Prepack({
        id: rows[0].Id,
        name: rows[0].Name,
        finalWeight: rows[0].FinalWeight,
        ingredients: isEmptyPrepack ? [] : rows.map(MapProductIngredientRow)
    });
}

