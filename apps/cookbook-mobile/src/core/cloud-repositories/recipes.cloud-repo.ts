import { FirestoreRepository } from "./base-firestore.cloud-repo";
import { injectable } from "inversify";
import { CloudRepositoryBase } from "./cloud-repo";
import { Recipe } from "@cookbook/domain/types/recipe/recipe";

export abstract class RecipesCloudRepository extends CloudRepositoryBase<Recipe>{ };

@injectable()
export class RecipesFirestore extends FirestoreRepository<Recipe>{

    constructor() {
        super('dev-recipes');
    }
};