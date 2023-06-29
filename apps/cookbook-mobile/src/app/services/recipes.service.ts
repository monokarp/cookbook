import { Ingridient } from "../../domain/types/recipe/ingridient";
import { Position, Recipe } from "../../domain/types/recipe/recipe";
import { IngridientEntity, RecipeEntity } from "../entities/recipe.entity";
import { RecipesRepository } from "../repositories/recipes.repository";
import { ProductsService } from "./products.service";
import { injectable, inject } from 'inversify';
import uuid from 'react-native-uuid';

@injectable()
export class RecipesService {

    @inject(RecipesRepository) private readonly recipesRepo!: RecipesRepository;
    @inject(ProductsService) private readonly productsService!: ProductsService;

    public Create(): Recipe {
        return new Recipe(
            uuid.v4().toString(),
            '',
            []
        );
    }

    public async All(): Promise<Recipe[]> {
        const entities = await this.recipesRepo.All();

        return Promise.all(entities.map(one => this.MapRecipeEntity(one)));
    }

    public Save(recipe: Recipe): Promise<void> {
        return this.recipesRepo.Save({
            id: recipe.id,
            name: recipe.name,
            positions: recipe.positions.map(one => ({
                productId: one.product.id,
                unitsPerServing: one.unitsPerServing
            }))
        });
    }

    private async MapRecipeEntity(entity: RecipeEntity): Promise<Recipe> {
        return new Recipe(
            entity.id,
            entity.name,
            await Promise.all(
                entity.positions.map(one => this.MapIngridientEntity(one))
            ));
    }

    private async MapIngridientEntity(entity: IngridientEntity): Promise<Position> {
        return new Ingridient(
            await this.productsService.One(entity.productId),
            entity.unitsPerServing
        );
    }
}
