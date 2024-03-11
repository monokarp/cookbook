import { isPrepackIngredient, isPrepackIngredientEntity, isProductIngredient, isProductIngredientEntity } from '@cookbook/domain/types/position/position';
import { PrepackIngredientEntity } from '@cookbook/domain/types/position/prepack-ingredient';
import { ProductIngredientEntity } from '@cookbook/domain/types/position/product-ingredient';
import { Recipe } from '@cookbook/domain/types/recipe/recipe';
import { inject, injectable } from 'inversify';
import uuid from 'react-native-uuid';
import { RecipesRepository } from '../repositories/recipes.repository';
import { MapById } from '../repositories/util';
import { Prepacks } from './prepacks';
import { Products } from './products';

@injectable()
export class Recipes {
    @inject(Products) private readonly products!: Products;
    @inject(Prepacks) private readonly prepacks!: Prepacks;
    @inject(RecipesRepository) private readonly recipesRepo!: RecipesRepository;

    public Create(): Recipe {
        return new Recipe({
            id: uuid.v4().toString(),
            name: '',
            lastModified: '',
            description: '',
            positions: [],
            groups: [],
        });
    }

    public async All(): Promise<Recipe[]> {
        const allRecipeEntities = await this.recipesRepo.All();

        const productIds: string[] = [];
        const prepackIds: string[] = [];

        for (const recipe of allRecipeEntities) {
            for (const one of recipe.positions) {
                if (isProductIngredientEntity(one)) {
                    productIds.push(one.productId);
                    continue;
                }

                if (isPrepackIngredientEntity(one)) {
                    prepackIds.push(one.prepackId);
                    continue;
                }

                throw new Error(`Unknown recipe ingredient type\n${JSON.stringify(one)}`);
            }
        }

        const [products, prepacks] = await Promise.all([
            this.products.Many(productIds),
            // @TODO refactor this to Many in case performance dips
            this.prepacks.All().then(items => items.filter(item => prepackIds.includes(item.id)))
        ]);

        const productsMap = MapById(products);
        const prepacksMap = MapById(prepacks);

        return allRecipeEntities.map(entity => new Recipe({
            id: entity.id,
            name: entity.name,
            lastModified: entity.lastModified,
            description: entity.description,
            positions: entity.positions.map(one => {
                if (isProductIngredientEntity(one)) {
                    return {
                        product: productsMap.get(one.productId),
                        serving: one.serving,
                    };
                }

                if (isPrepackIngredientEntity(one)) {
                    return {
                        prepack: prepacksMap.get(one.prepackId),
                        weightInGrams: one.weightInGrams,
                    }
                }

                throw new Error(`Unknown recipe ingredient type\n${JSON.stringify(one)}`);
            }),
            groups: entity.groups,
        }));
    }

    public async Save(recipe: Recipe): Promise<void> {
        return this.recipesRepo.Save({
            id: recipe.id,
            name: recipe.name,
            lastModified: recipe.lastModified,
            description: recipe.description,
            positions: recipe.positions.map(one => {
                if (isProductIngredient(one)) {
                    return {
                        productId: one.product.id,
                        serving: one.serving,
                    } as ProductIngredientEntity;
                }

                if (isPrepackIngredient(one)) {
                    return {
                        prepackId: one.prepack.id,
                        weightInGrams: one.weightInGrams,
                    } as PrepackIngredientEntity
                }

                throw new Error(`Unknown recipe ingredient type\n${JSON.stringify(one)}`);
            }),
            groups: recipe.groups,
        });
    }


    public UpdateDescription(id: string, description: string) {
        return this.recipesRepo.UpdateDescription(id, description);
    }

    public Delete(id: string): Promise<void> {
        return this.recipesRepo.Delete(id);
    }
}