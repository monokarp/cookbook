import uuid from 'react-native-uuid';
import { Product } from '../../domain/types/product/product';
import { PricedByWeight, PricedPerPiece, PricingInfo } from '../../domain/types/product/product-pricing';
import { PricingEntityInfo, ProductEntity, isEntityPricedByWeight, isEntityPricedPerPiece } from '../entities/product.entity';
import { ProductsRepository } from '../repositories/products.repository';
import { injectable, inject } from 'inversify';

@injectable()
export class ProductsService {

    @inject(ProductsRepository) private readonly productsRepo!: ProductsRepository;

    public Create(): Product {
        return new Product(
            uuid.v4().toString(),
            '',
            new PricedByWeight(0, 0)
        );
    }

    public async All(): Promise<Product[]> {
        const entities = await this.productsRepo.All();

        return entities.map(MapProductEntity);
    }

    public async One(id: string): Promise<Product | null> {
        const entity = await this.productsRepo.One(id);

        return entity ? MapProductEntity(entity) : null;
    }

    public Save(product: Product): Promise<void> {
        return this.productsRepo.Save(product);
    }
}

function MapProductEntity(entity: ProductEntity): Product {
    return new Product(entity.id, entity.name, MapPricingEntity(entity.pricing))
}

function MapPricingEntity(entity: PricingEntityInfo): PricingInfo {
    if (isEntityPricedByWeight(entity)) {
        return new PricedByWeight(entity.totalPrice, entity.totalGrams);
    }
    else if (isEntityPricedPerPiece(entity)) {
        return new PricedPerPiece(entity.totalPrice, entity.numberOfPieces, entity.gramsPerPiece)
    }

    throw Error('Unrecognized pricing entity type');
}
