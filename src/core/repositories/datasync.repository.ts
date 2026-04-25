import { Database } from "../database/database";

export class DatasyncRepository {

    constructor(private readonly database: Database) {}

    public async getLastSyncTime(): Promise<Date | null> {
        const [result] = await this.database.ExecuteSql('select [LastSyncedISO] from [DataSync] limit 1');

        return result.rows.length ? new Date(result.rows.item(0).LastSyncedISO) : null;
    }

    public async setLastSyncedTime(dateTime: Date) {
        await this.database.Transaction([
            ['delete from [DataSync]',[]],
            ['insert into [DataSync] ([LastSyncedISO]) values (?)', [dateTime.toISOString()]]
        ]);
    }
}