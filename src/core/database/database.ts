import { SQLiteDatabase, openDatabaseAsync } from "expo-sqlite";
import { migrations } from "./migrations";

export type Migration = {
    version: string;
    up: (db: SQLiteDatabase) => Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Query = [string, any[]];

export class Database {
    private sqliteDb: SQLiteDatabase | null = null;

    async Close(): Promise<void> {
        if (this.sqliteDb) {
            await this.sqliteDb.closeAsync();
        }
    }

    public async Init(): Promise<{ didRunMigrations: boolean; isFreshInstall: boolean }> {
        if (this.sqliteDb) {
            return { didRunMigrations: false, isFreshInstall: false };
        }

        await this.Open();

        const pendingMigrations = await this.GetPendingMigrations();

        console.log("Pending migrations:", pendingMigrations);

        for (const migration of pendingMigrations) {
            await migration.up(this.sqliteDb!);

            console.log(`Migration ${migration.version} applied`);

            await this.sqliteDb!.runAsync(`INSERT INTO [MigrationHistory] ([Version], [Created]) VALUES (?, ?)`, [
                migration.version,
                new Date().toISOString(),
            ]);

            console.log(`Migration info saved`);
        }

        return {
            didRunMigrations: !!pendingMigrations.length,
            isFreshInstall: !!pendingMigrations.length && pendingMigrations[0].version === "1",
        };
    }

    public async Transaction(queries: Query[]): Promise<void> {
        if (queries.length) {
            const db = this.sqliteDb!;
            await db.withTransactionAsync(async () => {
                for (const [sql, params] of queries) {
                    await db.runAsync(sql, params);
                }
            });
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async ExecuteSql<T = unknown>(sql: string, params: any[] = []): Promise<T[]> {
        return this.sqliteDb!.getAllAsync<T>(sql, params);
    }

    private async Open(): Promise<void> {
        this.sqliteDb = await openDatabaseAsync("cookbook.db");
        await this.sqliteDb.execAsync("PRAGMA foreign_keys = ON;");
    }

    private async GetPendingMigrations(): Promise<Migration[]> {
        if (!(await this.MigrationTableExists())) {
            console.log("Migration table does not exist, running all migrations");
            return migrations;
        }

        const appliedVersions = await this.GetAppliedMigrationVersions();
        console.log("Already applied migrations:", appliedVersions);

        if (appliedVersions.length > migrations.length) {
            throw new Error("Downgrade attempt, please uninstall local app version first");
        }

        const output: Migration[] = [];

        migrations.forEach((migration, index) => {
            const appliedVersion = appliedVersions[index];

            if (appliedVersion) {
                if (migration.version !== appliedVersion) {
                    throw new Error(
                        `Migration mismatch at index ${index}: ${migration} (in DB) !== ${migrations[index].version} (pending)`,
                    );
                }
            } else {
                output.push(migration);
            }
        });

        return output;
    }

    private async MigrationTableExists(): Promise<boolean> {
        const rows = await this.sqliteDb!.getAllAsync<{ name: string }>(
            `SELECT name FROM sqlite_master WHERE type='table' AND name='MigrationHistory';`,
        );
        return !!rows.length;
    }

    private async GetAppliedMigrationVersions(): Promise<string[]> {
        const rows = await this.sqliteDb!.getAllAsync<{ Version: string }>("SELECT [Version] FROM [MigrationHistory]");
        return rows.map(row => row.Version);
    }
}
