import uuid from 'react-native-uuid';
import { injectable } from 'inversify';
import { RecipeEntity } from '../entities/recipe.entity';

@injectable()
export class RecipesRepository {
    public static readonly Type = Symbol.for('RecipesRepository');

    private readonly recipes: RecipeEntity[] = [
        {
            id: '5cd4091b-c610-4371-a83b-5622438d24d9',
            name: 'Яблоко c бананом',
            positions: [
                {
                    productId: '5cd4091b-c610-4371-a83b-5622438d24d9',
                    unitsPerServing: 100
                },
                {
                    productId: 'd4ba3654-7f1b-4e19-9be3-81fda9874710',
                    unitsPerServing: 50
                }
            ]
        },
        {
            id: 'd4ba3654-7f1b-4e19-9be3-81fda9874710',
            name: 'Банан с морковкой',
            positions: [
                {
                    productId: 'd4ba3654-7f1b-4e19-9be3-81fda9874710',
                    unitsPerServing: 100
                },
                {
                    productId: '37feb6f9-f4a2-4b3e-ac30-0b49c95d171a',
                    unitsPerServing: 20
                }
            ]
        },
    ];

    public Create(): RecipeEntity {
        return {
            id: uuid.v4().toString(),
            name: '',
            positions: []
        }
    }

    public All(): Promise<RecipeEntity[]> {
        const copy: RecipeEntity[] = this.Copy(this.recipes);

        return Promise.resolve(copy);
    }

    public One(id: string): Promise<RecipeEntity | null> {
        const product = this.recipes.find(one => one.id === id);

        return Promise.resolve(product ? this.Copy(product) : null);
    }

    public Save(recipe: RecipeEntity): Promise<void> {
        return new Promise((res, rej) => {
            const existing = this.recipes.find(item => item.id === recipe.id)

            if (!existing) {
                this.recipes.push(recipe);
            } else {
                existing.name = recipe.name;
                existing.positions = this.Copy(recipe.positions);
            }

            res();
        });
    }

    private Copy<T>(item: T): T {
        return JSON.parse(JSON.stringify(item));
    }
}