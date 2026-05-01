import { SQLiteDatabase } from "expo-sqlite";
import { Migration } from "../database";

export const recursivePrepacks: Migration = {
    version: "6",
    up: async (db: SQLiteDatabase) => {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS [PrepackPrepackIngredients] (
                [PrepackId] TEXT NOT NULL,
                [PrepackIngredientId] TEXT NOT NULL,
                [PositionNumber] INTEGER NOT NULL,
                [WeightInGrams] INTEGER NOT NULL,
                PRIMARY KEY ([PrepackId], [PositionNumber]),
                FOREIGN KEY ([PrepackId]) REFERENCES [Prepacks]([Id]),
                FOREIGN KEY ([PrepackIngredientId]) REFERENCES [Prepacks]([Id])
            );
        `);
    },
};
