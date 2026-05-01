import { SQLiteDatabase } from "expo-sqlite";
import { Migration } from "../database";

export const addRecipePositionGroups: Migration = {
    version: "4",
    up: async (db: SQLiteDatabase) => {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS [RecipePositionGroups] (
                [RecipeId] TEXT NOT NULL,
                [Name] TEXT NOT NULL,
                [PositionIndicesCsv] TEXT NOT NULL,
                PRIMARY KEY ([RecipeId], [Name]),
                FOREIGN KEY ([RecipeId]) REFERENCES [Recipes]([Id])
            );
        `);
    },
};
