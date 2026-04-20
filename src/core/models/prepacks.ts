import { isPrepackIngredient, isPrepackIngredientEntity, isProductIngredient, isProductIngredientEntity } from '@cookbook/domain/types/position/position';
import { Prepack, PrepackEntity } from '@cookbook/domain/types/prepack/prepack';
import { inject, injectable } from 'inversify';
import uuid from 'react-native-uuid';
import { PrepacksRepository } from '../repositories/prepack.repository';
import { MapById } from '../repositories/util';
import { Products } from './products';

@injectable()
export class Prepacks {
    @inject(Products) private readonly products!: Products;
    @inject(PrepacksRepository) private readonly prepacksRepo!: PrepacksRepository;

    public Create(): Prepack {
        return new Prepack({
            id: uuid.v4().toString(),
            name: '',
            lastModified: '',
            finalWeight: 0,
            description: '',
            ingredients: [],
        });
    }

    public async All(): Promise<Prepack[]> {
        const allPrepackEntities = await this.prepacksRepo.All();

        const prepacksMap = new Map<string, PrepackEntity>();
        const leafProductIds = new Set<string>();

        for (const prepack of allPrepackEntities) {
            prepacksMap.set(prepack.id, prepack);

            for (const one of prepack.ingredients) {
                if (isProductIngredientEntity(one)) {
                    leafProductIds.add(one.productId);
                }
            }
        }

        const leafProducts = await this.products.Many(Array.from(leafProductIds.values()));
        const productsMap = MapById(leafProducts);

        function AttachIngredients(prepack: PrepackEntity): Prepack {
            return new Prepack({
                id: prepack.id,
                name: prepack.name,
                lastModified: prepack.lastModified,
                finalWeight: prepack.finalWeight,
                description: prepack.description,
                ingredients: prepack.ingredients.map(one => {
                    if (isProductIngredientEntity(one)) {
                        return {
                            product: productsMap.get(one.productId),
                            serving: one.serving,
                        };
                    }

                    if (isPrepackIngredientEntity(one)) {
                        return {
                            prepack: AttachIngredients(prepacksMap.get(one.prepackId)),
                            weightInGrams: one.weightInGrams,
                        }
                    }

                    throw new Error(`Unknown prepack ingredient type\n${JSON.stringify(one)}`);
                }),
            });
        }

        return allPrepackEntities.map(AttachIngredients);
    }

    public async Save(prepack: Prepack): Promise<void> {
        return this.prepacksRepo.Save(PrepackToEntity(prepack));
    }

    public async Delete(id: string): Promise<void> {
        return this.prepacksRepo.Delete(id);
    }
}

function PrepackToEntity(model: Prepack): PrepackEntity {
    return {
        ...model,
        ingredients: model.ingredients.map(one => {
            if (isProductIngredient(one)) {
                return {
                    productId: one.product.id,
                    serving: one.serving,
                }
            }

            if (isPrepackIngredient(one)) {
                return {
                    prepackId: one.prepack.id,
                    weightInGrams: one.weightInGrams,
                }
            }

            throw new Error(`Unknown prepack ingredient type\n${JSON.stringify(one)}`);
        }),
    };
}
