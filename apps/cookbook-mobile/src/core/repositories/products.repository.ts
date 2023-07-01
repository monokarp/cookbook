import { useObject, useQuery, useRealm } from '@realm/react';
import { injectable } from 'inversify';
import { ProductEntity } from "../entities/product.entity";
import { BaseRepository } from './base.repository';
import { ProductDto } from '../../domain/types/product/product';

@injectable()
export class ProductsRepository extends BaseRepository {
    // private readonly products: ProductEntity[] = [
    //     { id: '5cd4091b-c610-4371-a83b-5622438d24d9', name: 'Яблоко', pricing: { totalPrice: 6.54, totalGrams: 100 } },
    //     { id: 'd4ba3654-7f1b-4e19-9be3-81fda9874710', name: 'Банан', pricing: { totalPrice: 8.21, totalGrams: 50 } },
    //     { id: '37feb6f9-f4a2-4b3e-ac30-0b49c95d171a', name: 'Морковка', pricing: { totalPrice: 2.87, totalGrams: 25 } },
    // ];

    public All(): Promise<ProductDto[]> {
        return this.RunAsync(() => Array.from(useQuery(ProductEntity).snapshot().values()));
    }

    public One(id: string): Promise<ProductDto | null> {
        return this.RunAsync(() => useObject(ProductEntity, id));
    }

    public Save(entity: ProductDto): Promise<void> {
        return this.RunAsync(() => {
            const realm = useRealm();

            const existing = useObject(ProductEntity, entity.id)

            realm.write(() => {
                if (!existing) {
                    realm.create(ProductEntity, entity);
                } else {
                    existing.name = entity.name;
                    existing.pricing = entity.pricing;
                }
            });
        });
    }
}