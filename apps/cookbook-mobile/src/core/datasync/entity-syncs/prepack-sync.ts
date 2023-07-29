import { PrepackEntity } from "@cookbook/domain/types/recipe/prepack";
import { inject, injectable } from "inversify";
import { PrepacksCloudRepository } from "../../cloud-repositories/prepacks.cloud-repo";
import { PrepacksRepository } from "../../repositories/prepack.repository";
import { DataSync } from "../datasync.service";
import { BaseEntitySync } from "./base-entity-sync";

@injectable()
export class PrepacksSync extends BaseEntitySync<PrepackEntity> {

    @inject(DataSync) private readonly ds!: DataSync;

    @inject(PrepacksRepository) protected readonly localRepo!: PrepacksRepository;
    @inject(PrepacksCloudRepository) protected readonly cloudRepo!: PrepacksCloudRepository;

    constructor() {
        super();

        this.ds.register(this);
    }
}