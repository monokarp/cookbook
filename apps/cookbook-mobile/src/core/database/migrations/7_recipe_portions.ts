import { SQLiteDatabase } from "react-native-sqlite-storage";
import { Migration } from "../database";

export const recipePortions: Migration = {
    version: '7',
    up: async (db: SQLiteDatabase) => {
        await db.executeSql(`
            ALTER TABLE [Recipes]
            ADD COLUMN [Portions] INTEGER DEFAULT 1 NOT NULL;
        `);
    }
};