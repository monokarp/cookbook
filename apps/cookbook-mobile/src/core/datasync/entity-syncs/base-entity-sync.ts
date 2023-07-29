import { injectable } from "inversify";
import { DataSync } from "../datasync.service";
import { EntitySync } from "../entity-sync";

export class BaseEntitySync<E> implements EntitySync {

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
            await this.localRepo.SaveEntity(one);
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

    private log(msg: string): void {
        console.log(`datasync - ${this.cloudRepo.collectionName} - ${msg}`);
    }
}

interface LocalRepo<E> {
    SaveEntity: (entity: E) => Promise<void>;
    EntitiesModifiedAfter: (lastSynced: Date) => Promise<E[]>;
}

interface CloudRepo<E> {
    collectionName: string;
    Many: (userId: string) => Promise<E[]>;
    SaveMany: (userId: string, entities: E[]) => Promise<void>;
}