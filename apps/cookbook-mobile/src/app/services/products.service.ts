import { inject, injectable } from 'inversify';
import uuid from 'react-native-uuid';
import { ProductsRepository } from '../../core/repositories/products.repository';
import { Product } from '../../domain/types/product/product';
import { PricedByWeight } from '../../domain/types/product/product-pricing/by-weight';

@injectable()
export class ProductsService {

    @inject(ProductsRepository) private readonly productsRepo!: ProductsRepository;

    public Create(): Product {
        return new Product({
            id: uuid.v4().toString(),
            name: '',
            pricing: new PricedByWeight({ totalPrice: 0, totalGrams: 0 })
        });
    }

    public async All(): Promise<Product[]> {
        const entities = await this.productsRepo.All();

        return entities.map(dto => new Product(dto));
    }

    public async One(id: string): Promise<Product | null> {
        const dto = await this.productsRepo.One(id);

        return dto ? new Product(dto) : null;
    }

    public Save(product: Product): Promise<void> {
        return this.productsRepo.Save(product);
    }
}
