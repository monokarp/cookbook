import { Container } from 'inversify';
import { Database } from '../core/database/database';
import { SeedData } from '../core/database/seed-data';
import { ProductsRepository } from '../core/repositories/products.repository';
import { RecipesRepository } from '../core/repositories/recipes.repository';
import { PrepackRepository } from '../core/repositories/prepack.repository';

export function buildRootContainer() {
    const container = new Container();

    container.bind(Database).toSelf().inSingletonScope();

    container.bind(SeedData).toSelf().inSingletonScope();

    container.bind(ProductsRepository).toSelf().inSingletonScope();
    container.bind(PrepackRepository).toSelf().inSingletonScope();
    container.bind(RecipesRepository).toSelf().inSingletonScope();

    return container;
}
