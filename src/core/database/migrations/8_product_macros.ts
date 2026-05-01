import { SQLiteDatabase } from "expo-sqlite";
import { Migration } from "../database";

export const productMacros: Migration = {
    version: "8",
    up: async (db: SQLiteDatabase) => {
        await db.execAsync(`
            ALTER TABLE [Products] ADD COLUMN [Carbs] REAL DEFAULT 0 NOT NULL;
            ALTER TABLE [Products] ADD COLUMN [Prot] REAL DEFAULT 0 NOT NULL;
            ALTER TABLE [Products] ADD COLUMN [Fat] REAL DEFAULT 0 NOT NULL;
        `);
    },
};
