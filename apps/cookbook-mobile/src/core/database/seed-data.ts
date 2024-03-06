import { ProductEntity } from "@cookbook/domain/types/product/product";
import { ProductMeasuring } from "@cookbook/domain/types/product/product-pricing";
import { PrepackEntity } from "@cookbook/domain/types/prepack/prepack";
import { RecipeEntity } from "@cookbook/domain/types/recipe/recipe";
import { inject, injectable } from "inversify";
import { PrepacksRepository } from "../repositories/prepack.repository";
import { ProductsRepository } from "../repositories/products.repository";
import { RecipesRepository } from "../repositories/recipes.repository";

@injectable()
export class SeedData {
    @inject(ProductsRepository) private readonly productsRepo!: ProductsRepository;
    @inject(RecipesRepository) private readonly recipesRepo!: RecipesRepository;
    @inject(PrepacksRepository) private readonly prepacksRepo!: PrepacksRepository;

    private readonly products: ProductEntity[] = [
        {
            id: '5cd4091b-c610-4371-a83b-5622438d24d9',
            name: 'Яблоко',
            lastModified: new Date().toISOString(),
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
            lastModified: new Date().toISOString(),
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
            lastModified: new Date().toISOString(),
            pricing: {
                measuring: ProductMeasuring.Units,
                price: 2.87,
                weightInGrams: 25,
                numberOfUnits: 5
            }
        },
    ];

    private readonly prepacks: PrepackEntity[] = [
        {
            id: '13435459-4493-4326-b7f9-ff18b2630590',
            name: 'Яблоко c бананом',
            lastModified: new Date().toISOString(),
            finalWeight: 130,
            description: '',
            ingredients: [
                {
                    productId: '5cd4091b-c610-4371-a83b-5622438d24d9',
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 100
                    }
                },
                {
                    productId: 'd4ba3654-7f1b-4e19-9be3-81fda9874710',
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 200
                    }
                }
            ]
        },
        {
            id: '526d1a69-2a24-4b10-a747-8a6cda882d3e',
            name: 'Банан c морковкой',
            lastModified: new Date().toISOString(),
            finalWeight: 50,
            description: '',
            ingredients: [
                {
                    productId: 'd4ba3654-7f1b-4e19-9be3-81fda9874710',
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 100
                    }
                },
                {
                    productId: '37feb6f9-f4a2-4b3e-ac30-0b49c95d171a',
                    serving: {
                        measuring: ProductMeasuring.Units,
                        units: 2
                    }
                }
            ]
        }
    ];

    private readonly recipes: RecipeEntity[] = [
        {
            id: '905379dc-f444-4a9f-8d1b-fbc0576188ce',
            name: 'Яблоко c бананом',
            lastModified: new Date().toISOString(),
            description: '',
            positions: [
                {
                    productId: '5cd4091b-c610-4371-a83b-5622438d24d9',
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 100
                    }
                },
                {
                    productId: 'd4ba3654-7f1b-4e19-9be3-81fda9874710',
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 50
                    }
                }
            ],
            groups: [],
        },
        {
            id: 'b0250c1d-c8aa-4dfa-873f-4a64490028bf',
            name: 'Банан с морковкой',
            lastModified: new Date().toISOString(),
            description: '',
            positions: [
                {
                    productId: 'd4ba3654-7f1b-4e19-9be3-81fda9874710',
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 100
                    }
                },
                {
                    productId: '37feb6f9-f4a2-4b3e-ac30-0b49c95d171a',
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 20
                    }
                }
            ],
            groups: [],
        },
        {
            id: '4493f114-3fca-4a3b-aab4-ad48e3ca6372',
            name: 'Морковка с П/Ф',
            lastModified: new Date().toISOString(),
            description: '',
            positions: [
                {
                    productId: '37feb6f9-f4a2-4b3e-ac30-0b49c95d171a',
                    serving: {
                        measuring: ProductMeasuring.Units,
                        units: 3
                    }
                },
                {
                    prepackId: '13435459-4493-4326-b7f9-ff18b2630590',
                    weightInGrams: 200
                }
            ],
            groups: [],
        },
        {
            id: '3ff1c88a-2ce3-48cb-bbfb-be2544081d54',
            name: 'Рецепт с группами',
            lastModified: new Date().toISOString(),
            description: '',
            positions: [
                {
                    productId: '5cd4091b-c610-4371-a83b-5622438d24d9',
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 101
                    }
                },
                {
                    productId: 'd4ba3654-7f1b-4e19-9be3-81fda9874710',
                    serving: {
                        measuring: ProductMeasuring.Grams,
                        units: 102
                    }
                },
                {
                    productId: '37feb6f9-f4a2-4b3e-ac30-0b49c95d171a',
                    serving: {
                        measuring: ProductMeasuring.Units,
                        units: 3
                    }
                },
                {
                    productId: '37feb6f9-f4a2-4b3e-ac30-0b49c95d171a',
                    serving: {
                        measuring: ProductMeasuring.Units,
                        units: 5
                    }
                },
                {
                    prepackId: '13435459-4493-4326-b7f9-ff18b2630590',
                    weightInGrams: 104
                },
                {
                    prepackId: '526d1a69-2a24-4b10-a747-8a6cda882d3e',
                    weightInGrams: 105
                },
            ],
            groups: [
                {
                    name: 'Продукты',
                    positionIndices: [1, 2, 3],
                },
                {
                    name: 'Пфы',
                    positionIndices: [4, 5],
                }
            ],
        }
    ];

    public async Seed(): Promise<void> {
        for (const product of this.products) {
            await this.productsRepo.SaveEntity(product);
        }

        for (const prepack of this.prepacks) {
            await this.prepacksRepo.SaveEntity(prepack);
        }

        for (const recipe of this.recipes) {
            await this.recipesRepo.SaveEntity(recipe);
        }
    }
}