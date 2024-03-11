import { Product } from '@cookbook/domain/types/product/product';
import { ProductMeasuring, ProductPricing } from '@cookbook/domain/types/product/product-pricing';
import { inject, injectable } from 'inversify';
import uuid from 'react-native-uuid';
import { ProductsRepository } from '../repositories/products.repository';

@injectable()
export class Products {
    @inject(ProductsRepository) private readonly productsRepo!: ProductsRepository;

    public Create(): Product {
        return new Product({
            id: uuid.v4().toString(),
            name: '',
            lastModified: '',
            pricing: new ProductPricing({
                measuring: ProductMeasuring.Grams,
                price: 0,
                weightInGrams: 0,
                numberOfUnits: 0,
            })
        });
    }

    public async All(): Promise<Product[]> {
        const entities = await this.productsRepo.All();

        return entities.map(e => new Product(e));
    }

    public async Many(ids: string[]): Promise<Product[]> {
        const entities = await this.productsRepo.Many(ids);

        return entities.map(one => new Product(one));
    }

    public Save(product: Product): Promise<void> {
        return this.productsRepo.Save(product);
    }

    public Delete(id: string): Promise<void> {
        return this.productsRepo.Delete(id);
    }
}
