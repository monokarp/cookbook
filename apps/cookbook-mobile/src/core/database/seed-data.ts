import { Product, ProductDto } from "@cookbook/domain/types/product/product";
import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";
import { Prepack } from "@cookbook/domain/types/recipe/prepack";
import { PrepackIngredient } from "@cookbook/domain/types/recipe/prepack-ingredient";
import { ProductIngredient } from "@cookbook/domain/types/recipe/product-ingredient";
import { Recipe } from "@cookbook/domain/types/recipe/recipe";
import { inject, injectable } from "inversify";
import { PrepacksRepository } from "../repositories/prepack.repository";
import { ProductsRepository } from "../repositories/products.repository";
import { RecipesRepository } from "../repositories/recipes.repository";

@injectable()
export class SeedData {
    @inject(ProductsRepository) private readonly productsRepo!: ProductsRepository;
    @inject(RecipesRepository) private readonly recipesRepo!: RecipesRepository;
    @inject(PrepacksRepository) private readonly prepacksRepo!: PrepacksRepository;

    private readonly products: ProductDto[] = [
        {
            id: '5cd4091b-c610-4371-a83b-5622438d24d9',
            name: 'Яблоко',
            pricing: {
                measuring: ProductMeasuring.Grams,
                price: 6.54,
                weightInGrams: 100,
                numberOfUnits: 1
            }
        },
        {
            id: 'd4ba3654-7f1b-4e19-9be3-81fda9874710',
            name: 'Банан',
            pricing: {
                measuring: ProductMeasuring.Grams,
                price: 8.21,
                weightInGrams: 50,
                numberOfUnits: 1
            }
        },
        {
            id: '37feb6f9-f4a2-4b3e-ac30-0b49c95d171a',
            name: 'Морковка',
            pricing: {
                measuring: ProductMeasuring.Units,
                price: 2.87,
                weightInGrams: 25,
                numberOfUnits: 5
            }
        },
    ];

    private readonly prepacks: Prepack[] = [
        new Prepack({
            id: '13435459-4493-4326-b7f9-ff18b2630590',
            name: 'Яблоко c бананом',
            finalWeight: 130,
            ingredients: [
                new ProductIngredient({
                    product: new Product(this.products[0]),
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 100
                    }
                }),
                new ProductIngredient({
                    product: new Product(this.products[1]),
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 200
                    }
                })
            ]
        }),
        new Prepack({
            id: '526d1a69-2a24-4b10-a747-8a6cda882d3e',
            name: 'Банан c морковкой',
            finalWeight: 50,
            ingredients: [
                new ProductIngredient({
                    product: new Product(this.products[1]),
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 100
                    }
                }),
                new ProductIngredient({
                    product: new Product(this.products[2]),
                    serving: {
                        measuring: ProductMeasuring.Units,
                        units: 2
                    }
                })
            ]
        })
    ];

    private readonly recipes: Recipe[] = [
        new Recipe({
            id: '905379dc-f444-4a9f-8d1b-fbc0576188ce',
            name: 'Яблоко c бананом',
            positions: [
                new ProductIngredient({
                    product: new Product(this.products[0]),
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 100
                    }
                }),
                new ProductIngredient({
                    product: new Product(this.products[1]),
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 50
                    }
                })
            ]
        }),
        new Recipe({
            id: 'b0250c1d-c8aa-4dfa-873f-4a64490028bf',
            name: 'Банан с морковкой',
            positions: [
                new ProductIngredient({
                    product: new Product(this.products[1]),
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 100
                    }
                }),
                new ProductIngredient({
                    product: new Product(this.products[2]),
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 20
                    }
                })
            ]
        }),
        new Recipe({
            id: '4493f114-3fca-4a3b-aab4-ad48e3ca6372',
            name: 'Морковка с П/Ф',
            positions: [
                new ProductIngredient({
                    product: new Product(this.products[2]),
                    serving: {
                        measuring: ProductMeasuring.Units,
                        units: 3
                    }
                }),
                new PrepackIngredient({
                    prepack: this.prepacks[0],
                    weightInGrams: 200
                })
            ]
        })
    ];

    public async Seed(): Promise<void> {
        for (const product of this.products) {
            await this.productsRepo.Save(product);
        }

        for (const prepack of this.prepacks) {
            await this.prepacksRepo.Save(prepack);
        }

        for (const recipe of this.recipes) {
            await this.recipesRepo.Save(recipe);
        }
    }
}