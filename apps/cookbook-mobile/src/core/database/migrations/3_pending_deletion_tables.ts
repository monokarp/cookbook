import { SQLiteDatabase, Transaction } from "react-native-sqlite-storage";
import { Migration } from "../database";

export const pendingDeletionTables: Migration = {
    version: '3',
    up: async (db: SQLiteDatabase) => {
        await db.transaction(async (tx: Transaction) => {
            tx.executeSql(`
                CREATE TABLE IF NOT EXISTS [RecipesPendingDeletion] (
                    [Id] TEXT NOT NULL PRIMARY KEY
                );
            `);

            tx.executeSql(`
                CREATE TABLE IF NOT EXISTS [PrepacksPendingDeletion] (
                    [Id] TEXT NOT NULL PRIMARY KEY
                );
            `);

            tx.executeSql(`
                CREATE TABLE IF NOT EXISTS [ProductsPendingDeletion] (
                    [Id] TEXT NOT NULL PRIMARY KEY
                );
            `);
        });
    }
};