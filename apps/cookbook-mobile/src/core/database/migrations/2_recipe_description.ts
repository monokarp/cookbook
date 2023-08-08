import { SQLiteDatabase } from "react-native-sqlite-storage";
import { Migration } from "../database";

export const recipeDescription: Migration = {
    version: '2',
    up: async (db: SQLiteDatabase) => {
        await db.executeSql(`
            ALTER TABLE [Recipes]
            ADD COLUMN [Description] TEXT DEFAULT "" NOT NULL;
        `);
    }
};