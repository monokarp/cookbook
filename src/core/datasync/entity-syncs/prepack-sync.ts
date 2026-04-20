import { PrepackEntity } from "@cookbook/domain/types/prepack/prepack";
import { injectable } from "inversify";
import { PrepacksCloudRepository } from "../../cloud-repositories/prepacks.cloud-repo";
import { PrepacksRepository } from "../../repositories/prepack.repository";
import { DataSync } from "../datasync.service";
import { BaseEntitySync } from "./base-entity-sync";

@injectable()
export class PrepacksSync extends BaseEntitySync<PrepackEntity> {

    constructor(
        ds: DataSync,
        protected override readonly localRepo: PrepacksRepository,
        protected override readonly cloudRepo: PrepacksCloudRepository
    ) {
        super(ds);
    }
}