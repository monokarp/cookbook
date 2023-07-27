import { inject, injectable } from "inversify";
import { ProductsCloudRepository } from "../../cloud-repositories/products.cloud-repo";
import { ProductsRepository } from "../../repositories/products.repository";
import { EntitySync } from "../entity-sync.interface";
import { DataSync } from "../datasync.service";
import { DatasyncRepository } from "../../repositories/datasync.repository";

@injectable()
export class ProductsSync implements EntitySync {

    @inject(DataSync) private readonly ds!: DataSync;

    @inject(DatasyncRepository) private readonly dsRepo!: DatasyncRepository;
    @inject(ProductsRepository) private readonly localRepo!: ProductsRepository;
    @inject(ProductsCloudRepository) private readonly cloudRepo!: ProductsCloudRepository;

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