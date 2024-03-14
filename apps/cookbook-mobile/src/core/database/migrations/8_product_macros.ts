import { SQLiteDatabase } from "react-native-sqlite-storage";
import { Migration } from "../database";

export const productMacros: Migration = {
    version: '8',
    up: async (db: SQLiteDatabase) => {
        await db.executeSql(`
            ALTER TABLE [Products] ADD COLUMN [Carbs] REAL DEFAULT 0 NOT NULL;
        `);

        await db.executeSql(`
            ALTER TABLE [Products] ADD COLUMN [Prot] REAL DEFAULT 0 NOT NULL;
        `);

        await db.executeSql(`
            ALTER TABLE [Products] ADD COLUMN [Fat] REAL DEFAULT 0 NOT NULL;
        `);
    }
};