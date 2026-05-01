import { SQLiteDatabase } from "expo-sqlite";
import { Migration } from "../database";

export const pendingDeletionTables: Migration = {
    version: "3",
    up: async (db: SQLiteDatabase) => {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS [RecipesPendingDeletion] (
                [Id] TEXT NOT NULL PRIMARY KEY
            );

            CREATE TABLE IF NOT EXISTS [PrepacksPendingDeletion] (
                [Id] TEXT NOT NULL PRIMARY KEY
            );

            CREATE TABLE IF NOT EXISTS [ProductsPendingDeletion] (
                [Id] TEXT NOT NULL PRIMARY KEY
            );
        `);
    },
};
