import { RecipeEntity } from "@cookbook/domain/types/recipe/recipe";
import { injectable } from "inversify";
import { FirestoreRepository } from "./base-firestore.cloud-repo";
import { CloudRepositoryBase } from "./cloud-repo";

export abstract class RecipesCloudRepository extends CloudRepositoryBase<RecipeEntity>{ };

@injectable()
export class RecipesFirestore extends FirestoreRepository<RecipeEntity>{
    constructor() {
        super('recipes');
    }
};