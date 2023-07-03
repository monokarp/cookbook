import { inject, injectable } from 'inversify';
import uuid from 'react-native-uuid';
import { Product, ProductDto } from '../../domain/types/product/product';
import { Database } from '../database/database';
import { ProductPricing, ProductPricingType } from '../../domain/types/product/product-pricing';

@injectable()
export class ProductsRepository {

    @inject(Database) private readonly database!: Database;

    public Create(): Product {
        return new Product({
            id: uuid.v4().toString(),
            name: '',
            pricing: new ProductPricing({
                pricingType: ProductPricingType.ByWeight,
                totalPrice: 0,
                totalWeight: 0,
                numberOfUnits: 0,
            })
        });
    }

    public async All(): Promise<Product[]> {
        const [result] = await this.database.ExecuteSql(`
            SELECT [Id], [Name], [PricingType], [TotalPrice], [TotalWeight], [NumberOfUnits]
            FROM [Products]
            LEFT JOIN [ProductPricing] ON [ProductPricing].[ProductId] = [Products].[Id];
        `);

        return result.rows.raw().map(MapProductRow);
    }

    public async One(id: string): Promise<Product | null> {
        const [result] = await this.database.ExecuteSql(`
            SELECT [Id], [Name], [PricingType], [TotalPrice], [TotalWeight], [NumberOfUnits]
            FROM [Products]
            LEFT JOIN [ProductPricing] ON [ProductPricing].[ProductId] = [Products].[Id]
            WHERE [Id] = ?;
        `, [id]);

        return result.rows.length
            ? MapProductRow(result.rows.item(0))
            : null;
    }

    public async Save(product: ProductDto): Promise<void> {
        await this.database.ExecuteSql(`
            INSERT OR REPLACE INTO [Products] ([Id], [Name])
            VALUES (?, ?);
        `, [
            product.id,
            product.name,
        ]);

        await this.database.ExecuteSql(`
            INSERT OR REPLACE INTO [ProductPricing] ([ProductId], [PricingType], [TotalPrice], [TotalWeight], [NumberOfUnits])
            VALUES (?, ?, ?, ?, ?);
        `, [
            product.id,
            product.pricing.pricingType,
            product.pricing.totalPrice,
            product.pricing.totalWeight,
            product.pricing.numberOfUnits,
        ]);
    }
}

function MapProductRow(row: ProductRow): Product {
    return new Product({
        id: row.Id,
        name: row.Name,
        pricing: new ProductPricing({
            pricingType: row.PricingType,
            totalPrice: row.TotalPrice,
            totalWeight: row.TotalWeight,
            numberOfUnits: row.NumberOfUnits,
        })
    });
}

interface ProductRow {
    Id: string;
    Name: string;
    PricingType: ProductPricingType;
    TotalPrice: number;
    TotalWeight: number;
    NumberOfUnits: number;
}