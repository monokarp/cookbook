import { RecipeEntity } from "@cookbook/domain/types/recipe/recipe";
import { inject, injectable } from "inversify";
import { RecipesCloudRepository } from "../../cloud-repositories/recipes.cloud-repo";
import { RecipesRepository } from "../../repositories/recipes.repository";
import { DataSync } from "../datasync.service";
import { BaseEntitySync } from "./base-entity-sync";

@injectable()
export class RecipesSync extends BaseEntitySync<RecipeEntity> {

    @inject(DataSync) private readonly ds!: DataSync;

    @inject(RecipesRepository) protected readonly localRepo!: RecipesRepository;
    @inject(RecipesCloudRepository) protected readonly cloudRepo!: RecipesCloudRepository;

    constructor() {
        super();

        this.ds.register(this);
    }

}