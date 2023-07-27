import { injectable, inject } from "inversify";
import { RecipesCloudRepository } from "../../cloud-repositories/recipes.cloud-repo";
import { RecipesRepository } from "../../repositories/recipes.repository";
import { DataSync } from "../datasync.service";
import { EntitySync } from "../entity-sync.interface";


@injectable()
export class RecipesSync implements EntitySync {

    @inject(DataSync) private readonly ds!: DataSync;

    @inject(RecipesRepository) private readonly localRepo!: RecipesRepository;
    @inject(RecipesCloudRepository) private readonly cloudRepo!: RecipesCloudRepository;

    constructor() {
        this.ds.register(this);
    }

    public async recover(userId: string): Promise<void> {
        for (const one of await this.cloudRepo.many(userId)) {
            await this.localRepo.Save(one);
        }
    }
}