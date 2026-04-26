import { Database } from "../database/database";

export class DatasyncRepository {
    constructor(private readonly database: Database) {}

    public async getLastSyncTime(): Promise<Date | null> {
        const rows = await this.database.ExecuteSql<{ LastSyncedISO: string }>("select [LastSyncedISO] from [DataSync] limit 1");

        return rows.length ? new Date(rows[0].LastSyncedISO) : null;
    }

    public async setLastSyncedTime(dateTime: Date) {
        await this.database.Transaction([
            ["delete from [DataSync]", []],
            ["insert into [DataSync] ([LastSyncedISO]) values (?)", [dateTime.toISOString()]],
        ]);
    }
}
