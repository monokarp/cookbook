import { SQLiteDatabase } from "react-native-sqlite-storage";
import { Migration } from "../database";

export const prepackDescription: Migration = {
    version: '5',
    up: async (db: SQLiteDatabase) => {
        await db.executeSql(`
            ALTER TABLE [Prepacks]
            ADD COLUMN [Description] TEXT DEFAULT "" NOT NULL;
        `);
    }
};