import { SQLiteDatabase } from "expo-sqlite";
import { Migration } from "../database";

export const prepackDescription: Migration = {
    version: "5",
    up: async (db: SQLiteDatabase) => {
        await db.execAsync(`
            ALTER TABLE [Prepacks]
            ADD COLUMN [Description] TEXT DEFAULT "" NOT NULL;
        `);
    },
};
