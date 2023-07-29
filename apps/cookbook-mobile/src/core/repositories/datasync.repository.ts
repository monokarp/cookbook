import { inject, injectable } from "inversify";
import { Database } from "../database/database";

@injectable()
export class DatasyncRepository {

    @inject(Database) private readonly database!: Database;

    public async getLastSyncTime(): Promise<Date | null> {
        const [result] = await this.database.ExecuteSql('select [LastSyncedISO] from [DataSync] limit 1');

        return result.rows.length ? new Date(result.rows.item(0).LastSyncedISO) : null;
    }

    public async setLastSyncedTime(dateTime: Date) {
        await this.database.ExecuteSql(
            `delete from [DataSync];
            insert into [DataSync] ([LastSyncedISO]) values (?);`,
            [dateTime.toISOString()]
        );
    }
}