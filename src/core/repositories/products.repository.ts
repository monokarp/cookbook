import { ProductEntity } from "@cookbook/domain/types/product/product";
import { Database } from "../database/database";
import { MapProductRow, ProductWithPricingRow } from "./types/products";

export class ProductsRepository {
    private readonly SelectProductWithPricingRowsSQL = `SELECT
            [Id] as [ProductId],
            [Name] as [ProductName],
            [LastModified],
            [Carbs],
            [Prot],
            [Fat],
            [Measuring],
            [Price],
            [WeightInGrams],
            [NumberOfUnits]
        FROM [Products]
        LEFT JOIN [ProductPricing] ON [ProductPricing].[ProductId] = [Products].[Id]`;

    constructor(private readonly database: Database) {}

    public async All(): Promise<ProductEntity[]> {
        const rows = await this.database.ExecuteSql<ProductWithPricingRow>(this.SelectProductWithPricingRowsSQL);

        return rows.map(MapProductRow);
    }

    public async Many(ids: string[]): Promise<ProductEntity[]> {
        const rows = await this.database.ExecuteSql<ProductWithPricingRow>(
            `${this.SelectProductWithPricingRowsSQL}
            WHERE [ProductId] IN (${ids.map(() => "?").join(", ")});`,
            ids,
        );

        return rows.map(MapProductRow);
    }

    public async One(id: string): Promise<ProductEntity | null> {
        const rows = await this.database.ExecuteSql<ProductWithPricingRow>(
            `
            ${this.SelectProductWithPricingRowsSQL}
            WHERE [Id] = ?;
        `,
            [id],
        );

        return rows.length ? MapProductRow(rows[0]) : null;
    }

    public async Save(product: ProductEntity): Promise<void> {
        await this.database.Transaction([
            [
                `INSERT OR REPLACE INTO [Products] ([Id], [Name], [LastModified], [Carbs], [Prot], [Fat]) VALUES (?, ?, ?, ?, ?, ?);`,
                [
                    product.id,
                    product.name,
                    new Date().toISOString(),
                    product.nutrition.carbs,
                    product.nutrition.prot,
                    product.nutrition.fat,
                ],
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
                ],
            ],
        ]);
    }

    public async ModifiedAfter(date: Date): Promise<ProductEntity[]> {
        const rows = await this.database.ExecuteSql<ProductWithPricingRow>(
            `${this.SelectProductWithPricingRowsSQL}
            WHERE [LastModified] >= ?;`,
            [date.toISOString()],
        );

        return rows.map(MapProductRow);
    }

    public async Delete(id: string): Promise<void> {
        await this.database.Transaction([
            ["DELETE FROM [ProductPricing] WHERE [ProductId] = ?;", [id]],
            ["DELETE FROM [Products] WHERE [Id] = ?;", [id]],
            ["INSERT INTO [ProductsPendingDeletion] VALUES (?)", [id]],
        ]);
    }

    public async GetPendingDeletion(): Promise<string[]> {
        const rows = await this.database.ExecuteSql<{ Id: string }>("SELECT [Id] FROM [ProductsPendingDeletion]");

        return rows.map(row => row.Id);
    }

    public async ClearPendingDeletion(): Promise<void> {
        await this.database.ExecuteSql("DELETE FROM [ProductsPendingDeletion]");
    }
}
