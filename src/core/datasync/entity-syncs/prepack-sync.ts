import { PrepackEntity } from "@cookbook/domain/types/prepack/prepack";
import { PrepacksCloudRepository } from "../../cloud-repositories/prepacks.cloud-repo";
import { PrepacksRepository } from "../../repositories/prepack.repository";
import { DataSync } from "../datasync.service";
import { BaseEntitySync } from "./base-entity-sync";

export class PrepacksSync extends BaseEntitySync<PrepackEntity> {

    constructor(
        ds: DataSync,
        protected override readonly localRepo: PrepacksRepository,
        protected override readonly cloudRepo: PrepacksCloudRepository
    ) {
        super(ds);
    }
}