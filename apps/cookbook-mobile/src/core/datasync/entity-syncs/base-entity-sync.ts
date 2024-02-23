import { DataSync } from "../datasync.service";
import { EntitySync } from "../entity-sync";

export class BaseEntitySync<E extends { id: string }> implements EntitySync {

    protected readonly localRepo!: LocalRepo<E>;
    protected readonly cloudRepo!: CloudRepo<E>;

    constructor(ds: DataSync) {
        ds.register(this);
    }

    public async recover(userId: string): Promise<void> {
        this.log('recovery');
        const entities = await this.cloudRepo.Many(userId);

        this.log(`downloaded ${entities.length} entities`);

        for (const one of entities) {
            try {
                await this.localRepo.SaveEntity(one);
            } catch (e) {
                console.log(`error saving entity ${this.cloudRepo.collectionName} ${one.id}`, e);
            }
        }
    }

    public async sendPending(userId: string, lastSynced: Date): Promise<void> {
        this.log(`sending pending since ${lastSynced.toISOString()}`);

        const pendingEntities = await this.localRepo.EntitiesModifiedAfter(lastSynced);

        this.log(`found ${pendingEntities.length} matching entities`);

        if (pendingEntities.length) {
            await this.cloudRepo.SaveMany(userId, pendingEntities);
        }
    }

    public async clearDeleted(): Promise<void> {
        const ids = await this.localRepo.GetPendingDeletion();

        await this.cloudRepo.DeleteMany(ids);

        await this.localRepo.ClearPendingDeletion();
    }

    private log(msg: string): void {
        // console.log(`datasync - ${this.cloudRepo.collectionName} - ${msg}`);
    }
}

interface LocalRepo<E> {
    SaveEntity: (entity: E) => Promise<void>;
    EntitiesModifiedAfter: (lastSynced: Date) => Promise<E[]>;
    GetPendingDeletion(): Promise<string[]>;
    ClearPendingDeletion(): Promise<void>;
}

interface CloudRepo<E> {
    collectionName: string;
    Many: (userId: string) => Promise<E[]>;
    SaveMany: (userId: string, entities: E[]) => Promise<void>;
    DeleteMany(ids: string[]): Promise<void>;
}