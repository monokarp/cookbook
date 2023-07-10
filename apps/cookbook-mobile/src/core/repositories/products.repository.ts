import { inject, injectable } from 'inversify';
import uuid from 'react-native-uuid';
import { Product, ProductDto } from '../../domain/types/product/product';
import { ProductMeasuring, ProductPricing } from '../../domain/types/product/product-pricing';
import { Database } from '../database/database';

@injectable()
export class ProductsRepository {

    @inject(Database) private readonly database!: Database;

    public Create(): Product {
        return new Product({
            id: uuid.v4().toString(),
            name: '',
            pricing: new ProductPricing({
                measuring: ProductMeasuring.Grams,
                price: 0,
                weightInGrams: 0,
                numberOfUnits: 0,
            })
        });
    }

    public async All(): Promise<Product[]> {
        const [result] = await this.database.ExecuteSql(`
            SELECT [Id] as [ProductId], [Name] as [ProductName], [Measuring], [Price], [WeightInGrams], [NumberOfUnits]
            FROM [Products]
            LEFT JOIN [ProductPricing] ON [ProductPricing].[ProductId] = [Products].[Id];
        `);

        return result.rows.raw().map(MapProductRow);
    }

    public async One(id: string): Promise<Product | null> {
        const [result] = await this.database.ExecuteSql(`
            SELECT [Id] as [ProductId], [Name] as [ProductName], [Measuring], [Price], [WeightInGrams], [NumberOfUnits]
            FROM [Products]
            LEFT JOIN [ProductPricing] ON [ProductPricing].[ProductId] = [Products].[Id]
            WHERE [Id] = ?;
        `, [id]);

        return result.rows.length
            ? MapProductRow(result.rows.item(0))
            : null;
    }

    public async Save(product: ProductDto): Promise<void> {
        await this.database.Transaction([
            [
                `INSERT OR REPLACE INTO [Products] ([Id], [Name]) VALUES (?, ?);`,
                [product.id, product.name,]
            ],
            [
                `INSERT OR REPLACE INTO [ProductPricing] ([ProductId], [Measuring], [Price], [WeightInGrams], [NumberOfUnits])
                VALUES (?, ?, ?, ?, ?);`,
                [
                    product.id,
                    product.pricing.measuring,
                    product.pricing.price,
                    product.pricing.weightInGrams,
                    product.pricing.numberOfUnits,
                ]
            ]
        ]);
    }

    public async Delete(id: string): Promise<void> {
        await this.database.Transaction([
            ['DELETE FROM [ProductPricing]  WHERE [ProductId] = ?;', [id]],
            ['DELETE FROM [Products]  WHERE [Id] = ?;', [id]],
        ]);
    }
}

export function MapProductRow(row: ProductRow): Product {
    return new Product({
        id: row.ProductId,
        name: row.ProductName,
        pricing: new ProductPricing({
            measuring: row.Measuring,
            price: row.Price,
            weightInGrams: row.WeightInGrams,
            numberOfUnits: row.NumberOfUnits,
        })
    });
}

export interface ProductRow {
    ProductId: string;
    ProductName: string;
    Measuring: ProductMeasuring;
    Price: number;
    WeightInGrams: number;
    NumberOfUnits: number;
}