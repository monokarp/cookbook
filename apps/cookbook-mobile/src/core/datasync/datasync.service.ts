import { injectable } from "inversify";
import { EntitySync } from "./entity-sync.interface";

const SyncIntervalMs = 5000;

@injectable()
export class DataSync {
    private readonly syncs: EntitySync[] = [];

    public register(sync: EntitySync): void {
        this.syncs.push(sync);
    }

    public async recover(userId: string): Promise<void> {
        console.log('datasync recovery');

        try {
            for (const one of this.syncs) {
                await one.recover(userId);
            }
        } catch (e) {
            console.log('datasync recovery error', e);
        }
    }

    public async start(): Promise<void> {
        setInterval(async () => {
            try {
                for (const one of this.syncs) {
                    await one.sendPending();
                }
            } catch (e) {
                console.log('datasync error', e);
            }
        }, SyncIntervalMs);
    }
}