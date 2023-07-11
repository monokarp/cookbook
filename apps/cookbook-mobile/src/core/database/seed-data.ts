import { inject, injectable } from "inversify";
import { Product, ProductDto } from "../../domain/types/product/product";
import { ProductMeasuring } from "../../domain/types/product/product-pricing";
import { Ingredient } from "../../domain/types/recipe/ingredient";
import { Recipe } from "../../domain/types/recipe/recipe";
import { ProductsRepository } from "../repositories/products.repository";
import { RecipesRepository } from "../repositories/recipes.repository";
import { PrepackRepository } from "../repositories/prepack.repository";
import { Prepack } from "../../domain/types/recipe/prepack";

@injectable()
export class SeedData {
    @inject(ProductsRepository) private readonly productsRepo!: ProductsRepository;
    @inject(RecipesRepository) private readonly recipesRepo!: RecipesRepository;
    @inject(PrepackRepository) private readonly prepacksRepo!: PrepackRepository;

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
            name: 'Яблоко c бананом ПФ',
            finalWeight: 130,
            ingredients: [
                new Ingredient({
                    product: new Product(this.products[0]),
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 100
                    }
                }),
                new Ingredient({
                    product: new Product(this.products[1]),
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 200
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
                new Ingredient({
                    product: new Product(this.products[0]),
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 100
                    }
                }),
                new Ingredient({
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
                new Ingredient({
                    product: new Product(this.products[1]),
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 100
                    }
                }),
                new Ingredient({
                    product: new Product(this.products[2]),
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 20
                    }
                })
            ]
        }),
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