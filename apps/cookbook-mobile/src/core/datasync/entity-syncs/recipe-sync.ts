import { RecipeEntity } from "@cookbook/domain/types/recipe/recipe";
import { inject, injectable } from "inversify";
import { RecipesCloudRepository } from "../../cloud-repositories/recipes.cloud-repo";
import { RecipesRepository } from "../../repositories/recipes.repository";
import { DataSync } from "../datasync.service";
import { BaseEntitySync } from "./base-entity-sync";

@injectable()
export class RecipesSync extends BaseEntitySync<RecipeEntity> {

    constructor(
        ds: DataSync,
        protected override readonly localRepo: RecipesRepository,
        protected override readonly cloudRepo: RecipesCloudRepository
    ) {
        super(ds);
    }
}