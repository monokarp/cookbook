import { Ingridient } from "../../domain/types/recipe/ingridient";
import { Position, Recipe } from "../../domain/types/recipe/recipe";
import { IngridientData, RecipeData } from "../../core/entities/recipe.entity";
import { RecipesRepository } from "../../core/repositories/recipes.repository";
import { ProductsService } from "./products.service";
import { injectable, inject } from 'inversify';
import uuid from 'react-native-uuid';

@injectable()
export class RecipesService {

    @inject(RecipesRepository) private readonly recipesRepo!: RecipesRepository;
    @inject(ProductsService) private readonly productsService!: ProductsService;

    public Create(): Recipe {
        return new Recipe({
            id: uuid.v4().toString(),
            name: '',
            positions: []
        });
    }

    public async All(): Promise<Recipe[]> {
        const entities = await this.recipesRepo.All();

        return asyncMap(entities, one => this.MapRecipeEntity(one));
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

    private async MapRecipeEntity(entity: RecipeData): Promise<Recipe> {
        return new Recipe({
            id: entity.id,
            name: entity.name,
            positions: await asyncMap(entity.positions, one => this.MapIngridient(one))
        });
    }

    private async MapIngridient(entity: IngridientData): Promise<Position> {
        return new Ingridient({
            product: await this.productsService.One(entity.productId),
            unitsPerServing: entity.unitsPerServing
        });
    }
}

function asyncMap<T, U>(array: T[], callback: (item: T) => Promise<U>): Promise<U[]> {
    return Promise.all(array.map(callback));
}