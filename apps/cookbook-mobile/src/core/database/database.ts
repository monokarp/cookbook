import { ResultSet, SQLiteDatabase, Transaction, enablePromise, openDatabase } from 'react-native-sqlite-storage';
import { migrations } from './migrations';
import { injectable } from 'inversify';

enablePromise(true);

export type Migration = {
    version: string;
    up: (db: SQLiteDatabase) => Promise<void>
};

export type Query = [string, any[]];

@injectable()
export class Database {
    private sqliteDb: SQLiteDatabase | null = null;

    async Close(): Promise<void> {
        if (this.sqliteDb) {
            await this.sqliteDb.close();
        }
    }

    public async Init(): Promise<void> {
        if (this.sqliteDb) {
            return;
        }

        await this.Open();

        const pendingMigrations = await this.GetPendingMigrations();

        console.log('Pending migrations:', pendingMigrations);

        for (const migration of pendingMigrations) {
            await migration.up(this.sqliteDb);

            console.log(`Migration ${migration.version} applied`);

            await this.sqliteDb.executeSql(
                `INSERT INTO [MigrationHistory] ([Version], [Created]) VALUES (?, ?)`,
                [migration.version, new Date().toISOString()]
            );

            console.log(`Migration info saved`);
        }

        // TEMP
        const [result] = await this.sqliteDb.executeSql(`SELECT name FROM sqlite_master WHERE type='table'`);
        console.log('tables', result.rows.raw().map((row: { name: string }) => row.name));

        const appliedVersions = await this.GetAppliedMigrationVersions();
        console.log('Already applied migrations:', appliedVersions);
    }

    public async Transaction(queries: Query[]): Promise<void> {
        if (queries.length) {
            await this.sqliteDb.transaction(async (tx: Transaction) => {
                for (const [sql, params] of queries) {
                    tx.executeSql(sql, params);
                }
            });
        }
    }

    public async ExecuteSql(sql: string, params: any[] = []): Promise<[ResultSet]> {
        return this.sqliteDb.executeSql(sql, params);
    }

    private async Open(): Promise<void> {
        this.sqliteDb = await openDatabase({ name: 'cookbook.db', location: 'default' });
    }

    private async GetPendingMigrations(): Promise<Migration[]> {
        if (!await this.MigrationTableExists()) {
            console.log('Migration table does not exist, running all migrations');
            return migrations;
        };

        const appliedVersions = await this.GetAppliedMigrationVersions();
        console.log('Already applied migrations:', appliedVersions);

        if (appliedVersions.length > migrations.length) {
            throw new Error('Downgrade attempt, please uninstall local app version first');
        }

        const output = [];

        appliedVersions.forEach((version, index) => {
            const pending = migrations[index];

            if (pending) {
                if (version !== migrations[index].version) {
                    throw new Error(`Migration mismatch at index ${index}: ${version} (in DB) !== ${migrations[index].version} (pending)`);
                }
            } else {
                output.push(pending);
            }
        });

        return output;
    }

    private async MigrationTableExists(): Promise<boolean> {
        const [result] = await this.sqliteDb.executeSql(`SELECT name FROM sqlite_master WHERE type='table' AND name='MigrationHistory';`);

        return !!result.rows.length;
    }

    private async GetAppliedMigrationVersions(): Promise<string[]> {
        const [migrationsHistory] = await this.sqliteDb.executeSql('SELECT [Version] FROM [MigrationHistory]');
        return migrationsHistory.rows.raw().map((row: { Version: string }) => row.Version);
    }
}