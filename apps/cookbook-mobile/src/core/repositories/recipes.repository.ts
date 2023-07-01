import { useObject, useQuery, useRealm } from '@realm/react';
import { injectable } from 'inversify';
import { RecipeEntity, RecipeData } from '../entities/recipe.entity';
import { BaseRepository } from './base.repository';

@injectable()
export class RecipesRepository extends BaseRepository {

    // private readonly recipes: RecipeEntity[] = [
    //     {
    //         id: '5cd4091b-c610-4371-a83b-5622438d24d9',
    //         name: 'Яблоко c бананом',
    //         positions: [
    //             {
    //                 productId: '5cd4091b-c610-4371-a83b-5622438d24d9',
    //                 unitsPerServing: 100
    //             },
    //             {
    //                 productId: 'd4ba3654-7f1b-4e19-9be3-81fda9874710',
    //                 unitsPerServing: 50
    //             }
    //         ]
    //     },
    //     {
    //         id: 'd4ba3654-7f1b-4e19-9be3-81fda9874710',
    //         name: 'Банан с морковкой',
    //         positions: [
    //             {
    //                 productId: 'd4ba3654-7f1b-4e19-9be3-81fda9874710',
    //                 unitsPerServing: 100
    //             },
    //             {
    //                 productId: '37feb6f9-f4a2-4b3e-ac30-0b49c95d171a',
    //                 unitsPerServing: 20
    //             }
    //         ]
    //     },
    // ];

    public All(): Promise<RecipeData[]> {
        return this.RunAsync(() => Array.from(useQuery(RecipeEntity).snapshot().values()));
    }

    public One(id: string): Promise<RecipeData | null> {
        return this.RunAsync(() => useObject(RecipeEntity, id));
    }

    public Save(entity: RecipeData): Promise<void> {
        return this.RunAsync(() => {
            const realm = useRealm();

            const existing = useObject(RecipeEntity, entity.id)

            realm.write(() => {
                if (!existing) {
                    realm.create(RecipeEntity, entity);
                } else {
                    existing.name = entity.name;
                    existing.positions = entity.positions;
                }
            });
        });
    }
}