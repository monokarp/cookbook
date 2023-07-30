import { Product, ProductDto, ProductEntity } from '@cookbook/domain/types/product/product';
import { ProductMeasuring, ProductPricing } from '@cookbook/domain/types/product/product-pricing';
import { inject, injectable } from 'inversify';
import uuid from 'react-native-uuid';
import { Database } from '../database/database';

@injectable()
export class ProductsRepository {

    private readonly SelectProductRowsSQL =
        `SELECT [Id] as [ProductId], [Name] as [ProductName], [LastModified], [Measuring], [Price], [WeightInGrams], [NumberOfUnits]
        FROM [Products]
        LEFT JOIN [ProductPricing] ON [ProductPricing].[ProductId] = [Products].[Id]`;

    @inject(Database) private readonly database!: Database;

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
        const [result] = await this.database.ExecuteSql(this.SelectProductRowsSQL);

        return result.rows.raw().map(MapProductRow);
    }

    public async One(id: string): Promise<Product | null> {
        const [result] = await this.database.ExecuteSql(`
            ${this.SelectProductRowsSQL}
            WHERE [Id] = ?;
        `, [id]);

        return result.rows.length
            ? MapProductRow(result.rows.item(0))
            : null;
    }

    public async Save(product: ProductDto): Promise<void> {
        await this.database.Transaction([
            [
                `INSERT OR REPLACE INTO [Products] ([Id], [Name], [LastModified]) VALUES (?, ?, ?);`,
                [product.id, product.name, new Date().toISOString()]
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

    public async SaveEntity(entity: ProductEntity): Promise<void> {
        await this.database.Transaction([
            [
                `INSERT OR REPLACE INTO [Products] ([Id], [Name], [LastModified]) VALUES (?, ?, ?);`,
                [entity.id, entity.name, entity.lastModified]
            ],
            [
                `INSERT OR REPLACE INTO [ProductPricing] ([ProductId], [Measuring], [Price], [WeightInGrams], [NumberOfUnits])
                VALUES (?, ?, ?, ?, ?);`,
                [
                    entity.id,
                    entity.pricing.measuring,
                    entity.pricing.price,
                    entity.pricing.weightInGrams,
                    entity.pricing.numberOfUnits,
                ]
            ]
        ]);
    }

    public async EntitiesModifiedAfter(date: Date): Promise<Product[]> {
        const [result] = await this.database.ExecuteSql(
            `${this.SelectProductRowsSQL}
            WHERE [LastModified] >= ?;`,
            [date.toISOString()]
        );

        return result.rows.raw().map(MapProductRow);
    }

    public async Delete(id: string): Promise<void> {
        await this.database.Transaction([
            ['DELETE FROM [ProductPricing] WHERE [ProductId] = ?;', [id]],
            ['DELETE FROM [Products] WHERE [Id] = ?;', [id]],
        ]);
    }
}

export function MapProductRow(row: ProductRow): Product {
    return new Product({
        id: row.ProductId,
        name: row.ProductName,
        lastModified: row.LastModified,
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
    LastModified: string;
    Measuring: ProductMeasuring;
    Price: number;
    WeightInGrams: number;
    NumberOfUnits: number;
}