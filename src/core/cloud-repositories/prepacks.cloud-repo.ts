import { PrepackEntity } from "@cookbook/domain/types/prepack/prepack";
import { FirestoreRepository } from "./base-firestore.cloud-repo";
import { CloudRepositoryBase } from "./cloud-repo";

export abstract class PrepacksCloudRepository extends CloudRepositoryBase<PrepackEntity> {}

export class PrepacksFirestore extends FirestoreRepository<PrepackEntity> {
    constructor() {
        super("prepacks");
    }
}
