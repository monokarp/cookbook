import { FirestoreRepository } from "./base-firestore.cloud-repo";
import { injectable } from "inversify";
import { CloudRepositoryBase } from "./cloud-repo";
import { PrepackDto } from "@cookbook/domain/types/recipe/prepack";

export abstract class PrepacksCloudRepository extends CloudRepositoryBase<PrepackDto>{ };

@injectable()
export class PrepacksFirestore extends FirestoreRepository<PrepackDto>{

    constructor() {
        super('dev-prepacks');
    }
};