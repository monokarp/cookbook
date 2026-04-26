import { SQLiteDatabase } from "expo-sqlite";
import { Migration } from "../database";

export const recipeDescription: Migration = {
    version: "2",
    up: async (db: SQLiteDatabase) => {
        await db.execAsync(`
            ALTER TABLE [Recipes]
            ADD COLUMN [Description] TEXT DEFAULT "" NOT NULL;
        `);
    },
};
