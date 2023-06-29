import { injectable } from 'inversify';
import { ProductEntity } from "../entities/product.entity";

@injectable()
export class ProductsRepository {
    private readonly products: ProductEntity[] = [
        { id: '5cd4091b-c610-4371-a83b-5622438d24d9', name: 'Яблоко', pricing: { totalPrice: 6.54, totalGrams: 100 } },
        { id: 'd4ba3654-7f1b-4e19-9be3-81fda9874710', name: 'Банан', pricing: { totalPrice: 8.21, totalGrams: 50 } },
        { id: '37feb6f9-f4a2-4b3e-ac30-0b49c95d171a', name: 'Морковка', pricing: { totalPrice: 2.87, totalGrams: 25 } },
    ];

    public All(): Promise<ProductEntity[]> {
        const copy: ProductEntity[] = this.Copy(this.products);

        return Promise.resolve(copy);
    }

    public One(id: string): Promise<ProductEntity | null> {
        const product = this.products.find(one => one.id === id);

        return Promise.resolve(product ? this.Copy(product) : null);
    }

    public Save(entity: ProductEntity): Promise<void> {
        return new Promise((res, rej) => {
            const existing = this.products.find(item => item.id === entity.id)

            if (!existing) {
                this.products.push(entity);
            } else {
                existing.name = entity.name;
                existing.pricing = entity.pricing;
            }

            res();
        });
    }

    private Copy<T>(item: T): T {
        return JSON.parse(JSON.stringify(item));
    }
}