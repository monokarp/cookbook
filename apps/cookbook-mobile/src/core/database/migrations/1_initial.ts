import { SQLiteDatabase, Transaction } from "react-native-sqlite-storage";
import { Migration } from "../database";

export const initialMigration: Migration = {
    version: '1',
    up: async (db: SQLiteDatabase) => {
        await db.executeSql('PRAGMA foreign_keys = ON;');

        await db.transaction(async (tx: Transaction) => {


            tx.executeSql(`
                CREATE TABLE IF NOT EXISTS [MigrationHistory] (
                    [Version] TEXT NOT NULL PRIMARY KEY,
                    [Created] DATETIME NOT NULL
                );
            `);

            tx.executeSql(`
                CREATE TABLE IF NOT EXISTS [Recipes] (
                    [Id] TEXT NOT NULL PRIMARY KEY,
                    [Name] TEXT NOT NULL
                );
            `);

            tx.executeSql(`
                CREATE TABLE IF NOT EXISTS [Products] (
                    [Id] TEXT NOT NULL PRIMARY KEY,
                    [Name] TEXT NOT NULL
                );
            `);

            tx.executeSql(`
                CREATE TABLE IF NOT EXISTS [ProductMeasuring] (
                    [Value] TEXT NOT NULL PRIMARY KEY
                );
            `);

            tx.executeSql(`
                INSERT INTO [ProductMeasuring] ([Value]) VALUES ('grams'), ('units');
            `);

            tx.executeSql(`
                CREATE TABLE IF NOT EXISTS [Ingridients] (
                    [RecipeId] TEXT NOT NULL,
                    [PositionNumber] INTEGER NOT NULL,
                    [ProductId] TEXT NOT NULL,
                    [ServingUnits] REAL NOT NULL,
                    [ServingMeasuring] TEXT NOT NULL,
                    PRIMARY KEY ([RecipeId], [PositionNumber]),
                    FOREIGN KEY ([ServingMeasuring]) REFERENCES [ProductMeasuring]([Value]),
                    FOREIGN KEY ([RecipeId]) REFERENCES [Recipes]([Id]),
                    FOREIGN KEY ([ProductId]) REFERENCES [Products]([Id])
                );
            `);

            tx.executeSql(`
                CREATE TABLE IF NOT EXISTS [ProductPricing] (
                    [ProductId] TEXT NOT NULL PRIMARY KEY,
                    [Measuring] TEXT NOT NULL,
                    [Price] REAL NOT NULL,
                    [WeightInGrams] REAL NOT NULL,
                    [NumberOfUnits] REAL NOT NULL,
                    FOREIGN KEY ([Measuring]) REFERENCES [ProductMeasuring]([Value]),
                    FOREIGN KEY ([ProductId]) REFERENCES [Products]([Id])
                );
            `);
        });
    }
};