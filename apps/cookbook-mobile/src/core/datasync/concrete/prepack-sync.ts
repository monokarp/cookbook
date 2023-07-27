import { inject, injectable } from "inversify";
import { EntitySync } from "../entity-sync.interface";
import { PrepacksRepository } from "../../repositories/prepack.repository";
import { PrepacksCloudRepository } from "../../cloud-repositories/prepacks.cloud-repo";
import { DataSync } from "../datasync.service";
import { DatasyncRepository } from "../../repositories/datasync.repository";

@injectable()
export class PrepacksSync implements EntitySync {

    @inject(DataSync) private readonly ds!: DataSync;

    @inject(DatasyncRepository) private readonly dsRepo!: DatasyncRepository;
    @inject(PrepacksRepository) private readonly localRepo!: PrepacksRepository;
    @inject(PrepacksCloudRepository) private readonly cloudRepo!: PrepacksCloudRepository;

    constructor() {
        this.ds.register(this);
    }

    public async recover(userId: string): Promise<void> {
        for (const one of await this.cloudRepo.many(userId)) {
            await this.localRepo.Save(one);
        }
    }

    public async sendPending(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}