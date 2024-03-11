import { PrepackEntity } from "@cookbook/domain/types/prepack/prepack";
import { injectable } from "inversify";
import { FirestoreRepository } from "./base-firestore.cloud-repo";
import { CloudRepositoryBase } from "./cloud-repo";

export abstract class PrepacksCloudRepository extends CloudRepositoryBase<PrepackEntity>{ };

@injectable()
export class PrepacksFirestore extends FirestoreRepository<PrepackEntity>{
    constructor() {
        super('prepacks');
    }
};