import NetInfo from "@react-native-community/netinfo";
import { inject, injectable } from "inversify";
import { DatasyncRepository } from "../repositories/datasync.repository";
import { EntitySync } from "./entity-sync";

const SyncIntervalMs = 10 * 1000;

@injectable()
export class DataSync {
    private readonly syncs: EntitySync[] = [];

    @inject(DatasyncRepository) protected readonly dsRepo!: DatasyncRepository;

    public register(sync: EntitySync): void {
        this.syncs.push(sync);
    }

    public async recover(userId: string): Promise<void> {
        try {
            for (const one of this.syncs) {
                if (await this.hasNetwork()) {
                    await one.recover(userId);
                }
            }
        } catch (e) {
            console.log('datasync recovery error', e);
        }
    }

    public async start(userId: string): Promise<void> {
        setInterval(async () => {
            try {
                if (await this.hasNetwork()) {
                    const lastSynced = await this.dsRepo.getLastSyncTime();

                    if (lastSynced) {
                        for (const one of this.syncs) {
                            await one.sendPending(userId, lastSynced);

                            await one.clearDeleted();
                        }
                    }

                    await this.dsRepo.setLastSyncedTime(new Date());
                }
            } catch (e) {
                console.log('datasync error', e);
            }
        }, SyncIntervalMs);
    }

    private async hasNetwork(): Promise<boolean> {
        const { isConnected } = await NetInfo.fetch();
        return isConnected;
    }
}