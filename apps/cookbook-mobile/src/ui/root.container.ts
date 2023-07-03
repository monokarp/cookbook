import { Container } from 'inversify';
import { Database } from '../core/database/database';
import { ProductsRepository } from '../core/repositories/products.repository';
import { RecipesRepository } from '../core/repositories/recipes.repository';
import { SeedData } from '../core/database/seed-data';

export function buildRootContainer() {
    const container = new Container();

    container.bind(Database).toSelf().inSingletonScope();

    container.bind(SeedData).toSelf().inSingletonScope();

    container.bind(ProductsRepository).toSelf().inSingletonScope();
    container.bind(RecipesRepository).toSelf().inSingletonScope();

    return container;
}
