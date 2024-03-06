import { SQLiteDatabase } from "react-native-sqlite-storage";
import { Migration } from "../database";


export const prepackDescription: Migration = {
    version: '5',
    up: async (db: SQLiteDatabase) => {
        await db.executeSql(`
            CREATE TABLE IF NOT EXISTS [PrepackPrepackIngredients] (
                [PrepackContainerId] TEXT NOT NULL,
                [PrepackIngredientId] TEXT NOT NULL,
                [PositionNumber] INTEGER NOT NULL,
                [WeightInGrams] INTEGER NOT NULL,
                PRIMARY KEY ([PrepackContainerId], [PositionNumber]),
                FOREIGN KEY ([PrepackContainerId]) REFERENCES [Prepacks]([Id]),
                FOREIGN KEY ([PrepackIngredientId]) REFERENCES [Prepacks]([Id])
            );
        `);
    }
};